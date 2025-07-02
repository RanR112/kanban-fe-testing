import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { DEPARTMENT_MAP } from "../../utils/constants";
import "../../sass/Kanban/ReqForm/ReqForm.css";
import { LoaderButton } from "../../components/LoaderButton";
import { useKanban } from "../../contexts/KanbanContext";
import { useAuth } from "../../contexts/AuthContext";

export default function ReqForm() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { createRequest, loading, validateRequestData } = useKanban();

    const [formData, setFormData] = useState({
        tgl_produksi: "",
        parts_number: "",
        nama_requester: "",
        klasifikasi: "",
        customClassification: "",
        box: "",
        lokasi: "",
        keterangan: "",
    });

    const [process, setProcess] = useState("");

    const { handleShowAlertFormReq } = useOutletContext();
    const inputRef = useRef(null);

    useEffect(() => {
        // Set process from user context
        if (user && user.department) {
            setProcess(
                DEPARTMENT_MAP[user.department.name] || user.department.name
            );
        }
    }, [user]);

    useEffect(() => {
        if (formData.klasifikasi === "Lainnya" && inputRef.current) {
            inputRef.current.focus();
        }
    }, [formData.klasifikasi]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            ...formData,
            klasifikasi:
                formData.klasifikasi === "Lainnya"
                    ? formData.customClassification
                    : formData.klasifikasi,
            tgl_produksi: new Date(formData.tgl_produksi).toISOString(),
        };

        // Remove custom classification field before sending
        delete dataToSend.customClassification;

        try {
            const result = await createRequest(dataToSend);

            if (result.success) {
                // Tampilkan alert sukses
                handleShowAlertFormReq(true);

                // Reset form
                setFormData({
                    tgl_produksi: "",
                    parts_number: "",
                    nama_requester: "",
                    klasifikasi: "",
                    customClassification: "",
                    box: "",
                    lokasi: "",
                    keterangan: "",
                });
            } else {
                // Handle error from validation or API
                console.log(result.message || "Gagal membuat request");
            }
        } catch (error) {
            console.error("Error creating request:", error);
        }
    };

    return (
        <div className="req-form-container">
            <h2>KANBAN INTERNAL REISSUE REQUEST FORMAT</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <div className="production-date">
                        <label>Production Date</label>
                        <input
                            type="date"
                            name="tgl_produksi"
                            value={formData.tgl_produksi}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="parts-number">
                        <label>Parts Number</label>
                        <input
                            type="text"
                            name="parts_number"
                            value={formData.parts_number}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="request-name">
                        <label>Requester Name</label>
                        <input
                            type="text"
                            name="nama_requester"
                            value={formData.nama_requester}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="classification">
                        <label>Classification</label>
                        {formData.klasifikasi === "Lainnya" ? (
                            <>
                                <input
                                    type="text"
                                    name="customClassification"
                                    placeholder="Masukkan klasifikasi lainnya"
                                    value={formData.customClassification || ""}
                                    onChange={handleChange}
                                    ref={inputRef}
                                    className="classification-input"
                                    required
                                    onBlur={() => {
                                        if (!formData.customClassification) {
                                            setFormData((prev) => ({
                                                ...prev,
                                                klasifikasi: "",
                                                customClassification: "",
                                            }));
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    className="btn-cancel-lainnya"
                                    onClick={() => {
                                        if (formData.customClassification) {
                                            setFormData((prev) => ({
                                                ...prev,
                                                klasifikasi:
                                                    prev.customClassification,
                                            }));
                                        } else {
                                            setFormData((prev) => ({
                                                ...prev,
                                                klasifikasi: "",
                                            }));
                                        }
                                    }}
                                >
                                    ⟵
                                </button>
                            </>
                        ) : (
                            <select
                                name="klasifikasi"
                                value={formData.klasifikasi}
                                required
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFormData((prev) => ({
                                        ...prev,
                                        klasifikasi: value,
                                        ...(value !== "Lainnya" && {
                                            customClassification: "",
                                        }),
                                    }));
                                }}
                                className="classification-select"
                            >
                                <option
                                    value={
                                        formData.customClassification !== ""
                                            ? `${formData.customClassification}`
                                            : ""
                                    }
                                >
                                    {formData.customClassification !== ""
                                        ? `${formData.customClassification}`
                                        : "Select an Option"}
                                </option>
                                <option value="Baru">Baru</option>
                                <option value="Rusak">Rusak</option>
                                <option value="Hilang">Hilang</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        )}
                    </div>

                    <div className="box">
                        <label>Box</label>
                        <input
                            type="text"
                            name="box"
                            value={formData.box}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="process">
                        <label>Process</label>
                        <input
                            type="text"
                            name="process"
                            readOnly
                            value={process}
                        />
                    </div>
                    <div className="location">
                        <label>Location</label>
                        <input
                            type="text"
                            name="lokasi"
                            value={formData.lokasi}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="information">
                        <label>Information</label>
                        <textarea
                            name="keterangan"
                            value={formData.keterangan}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                </div>
                <div className="form-buttons">
                    <button
                        type="button"
                        className="back-btn"
                        onClick={() => navigate("/user/request-kanban")}
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? <LoaderButton /> : "Submit"}
                    </button>
                </div>
            </form>
        </div>
    );
}
