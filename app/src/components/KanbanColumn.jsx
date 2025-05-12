import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

const KanbanColumn = ({column}) => {

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column
        }
    })

    const style = {
        transition, 
        transform: CSS.Transform.toString(transform),
    }

    if (isDragging) {
        return ( <article ref={setNodeRef} style={style} className="column dragging"></article>)
    }

    return (
        <article ref={setNodeRef} style={style} className="column">
            <div className="heading-box" {...attributes} {...listeners}>
                <p>
                    {column.title}
                </p>
            </div>
        </article>
    )
}

export default KanbanColumn;