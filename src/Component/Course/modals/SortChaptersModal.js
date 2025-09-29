"use client"

import { useState } from "react"
import { ArrowUpDownIcon as ArrowsUpDownIcon } from "lucide-react"

const SortChaptersModal = ({ isOpen, onClose, chapters }) => {
    const [sortedChapters, setSortedChapters] = useState([...chapters])

    if (!isOpen) return null

    const truncate = (text) => {
        return text && text.length > 40 ? text.substring(0, 40) + "..." : text
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // In a real app, you would submit the sorted chapters to your backend
        console.log("Sorted chapters:", sortedChapters)
        onClose()
    }

    return (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-modal="true" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">Sort Chapters</h1>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="p-3">
                        <form className="chapter_sorting_form" onSubmit={handleSubmit}>
                            <ul className="list-group draggable-list">
                                {sortedChapters.map((chapter) => (
                                    <li key={chapter.id} className="list-group-item mb-2" data-order={chapter.id}>
                                        <input type="hidden" name="chapter_ids[]" value={chapter.id} />
                                        <div className="course_shorting d-flex flex-wrap justify-content-between align-items-center">
                                            <div className="d-flex flex-wrap align-items-center">
                                                <span className="icon-container">
                                                    <i className="fas fa-play"></i>
                                                </span>
                                                <p className="mb-0 ms-2 bold-text">{truncate(chapter.title)}</p>
                                            </div>
                                            <div className="item-action">
                                                <a href="javascript:;" className="ms-2 text-dark dragger">
                                                    <ArrowsUpDownIcon size={16} />
                                                </a>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                            Save changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SortChaptersModal