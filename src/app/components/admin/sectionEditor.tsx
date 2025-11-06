"use client"

import { Section } from "@/app/services/articleService"
import { useEffect, useId, useState } from "react"

type Props = {
    section: Section
    editing: boolean
    onSave: (section: Section) => void
    onCancel: () => void
}

export default function SectionEditor(props: Props) {
    let [section, setSection] = useState<Section>(props.section)
    const idFieldId = useId();
    const titleFieldId = useId();
    const descriptionFieldId = useId();
    const indexFieldId = useId();

    useEffect(() => {
        setSection(props.section)
    }, [props.section])
    
    return <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold">{props.editing ? "Edit Section" : "Create Section"}</h1>
        {!props.editing ? <div>
            <label className="block" htmlFor={idFieldId}>Section ID</label>
            <input id={idFieldId} type="text" placeholder="ID" value={section.id} onChange={(e) => setSection({ ...section, id: e.target.value })}></input>
        </div> : ""}
        <label className="block" htmlFor={titleFieldId}>Section Title</label>
        <input id={titleFieldId} type="text" placeholder="Title" value={section.title} onChange={(e) => setSection({ ...section, title: e.target.value })}></input>
        <label className="block" htmlFor={descriptionFieldId}>Description</label>
        <textarea id={descriptionFieldId} value={section.description} onChange={e => setSection({ ...section, description: e.target.value })}></textarea>
        <label className="block" htmlFor={indexFieldId}>Index</label>
        <input id={indexFieldId} type="number" value={section.index ?? 0} onChange={e => setSection({ ...section, index: Number(e.target.value) })}></input>
        <div className="flex flex-row gap-1">
            <button className="btn-primary font-mono flex-1" type="button" onClick={() => props.onSave(section)}> {props.editing ? "Save" : "Create"} </button>
            <button className="btn-secondary font-mono" type="button" onClick={props.onCancel}> Cancel </button>
        </div>
    </div>
}