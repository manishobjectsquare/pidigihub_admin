"use client"

import { useState, useEffect } from "react"

const AddDocumentModal = ({ isOpen, onClose, chapters, chapterId, type }) => {
    const [formData, setFormData] = useState({
        course_id: "",
        chapter_id: chapterId || "",
        type: type || "document",
        chapter: chapterId || "",
        title: "",
        file_type: "",
        description: "",
        upload_path: "",
    })

    useEffect(() => {
        setFormData({
            ...formData,
            chapter_id: chapterId || "",
            chapter: chapterId || "",
            type: type || "document",
        })
    }, [chapterId, type])

    if (!isOpen) return null

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // In a real app, you would submit the form data to your backend
        console.log("Form submitted:", formData)
        onClose()
    }

    return (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-modal="true" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Add Document</h1>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="p-3">
                        <form className="add_lesson_form instructor__profile-form" onSubmit={handleSubmit}>
                            <input type="hidden" name="course_id" value={formData.course_id} />
                            <input type="hidden" name="chapter_id" value={formData.chapter_id} />
                            <input type="hidden" name="type" value={formData.type} />

                            <div className="col-md-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="chapter">
                                        Chapter <code>*</code>
                                    </label>
                                    <select
                                        name="chapter"
                                        id="chapter"
                                        className="chapter from-select form-select"
                                        value={formData.chapter}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select</option>
                                        {chapters.map((chapter) => (
                                            <option key={chapter.id} value={chapter.id}>
                                                {chapter.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="col-md-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="title">
                                        Title <code>*</code>
                                    </label>
                                    <input
                                        id="title"
                                        name="title"
                                        className="form-control"
                                        type="text"
                                        value={formData.title}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-9 upload">
                                    <div className="from-group mb-3">
                                        <label className="form-file-manager-label" htmlFor="">
                                            Path <code>*</code>
                                        </label>
                                        <div className="input-group custom-frm-bx">
                                            <span className="input-group-text" id="basic-addon1">
                                                <a className="file-manager">
                                                    <i className="fa fa-picture-o"></i> Choose
                                                </a>
                                            </span>
                                            <input
                                                id="path"
                                                readOnly
                                                className="from-control file-manager-input form-control"
                                                type="text"
                                                name="upload_path"
                                                value={formData.upload_path}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="custom-frm-bx">
                                        <label htmlFor="file_type_select">
                                            File Type <code>*</code>
                                        </label>
                                        <select
                                            name="file_type"
                                            id="file_type_select"
                                            className="file_type form-select"
                                            value={formData.file_type}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select</option>
                                            <option value="pdf">PDF</option>
                                            <option value="txt">TXT</option>
                                            <option value="docx">DOCX</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="custom-frm-bx">
                                    <label htmlFor="description">
                                        Description <code></code>
                                    </label>
                                    <textarea
                                        name="description"
                                        className="form-control"
                                        value={formData.description}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary submit-btn">
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddDocumentModal
