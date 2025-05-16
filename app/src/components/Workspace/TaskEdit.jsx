import { useState } from "react";

const TaskEdit = ({ task }) => {
  const [headingEditMode, setHeadingEditMode] = useState(false);
  const [inputTitle, setInputTitle] = useState(task.title); 

  const updateTitle = (text) => {
    setInputTitle(text);
  };

  const saveTitle = () => {
    task.title = inputTitle;
    setHeadingEditMode(false);
  };

  return (
    <div className="task-edit-wrapper">
      <article className="task-edit-container">
        <section className="description-wrapper">
            <header>
            {headingEditMode ? (
                <input
                type="text"
                autoFocus
                value={inputTitle}
                onChange={(e) => updateTitle(e.target.value)}
                onBlur={saveTitle}
                onKeyDown={(e) => e.key === "Enter" && saveTitle()}
                size={inputTitle.length}
                />
            ) : (
                <h3 onClick={() => setHeadingEditMode(true)}>{task.title}</h3>
            )}
            </header>

            <div className="description-container">
                <h4>
                    Description:
                </h4>

                <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos, atque fuga labore magnam dignissimos necessitatibus in commodi pariatur facilis fugiat blanditiis eveniet odit ab odio rerum? Autem commodi libero molestias.
                </p>
            </div>
        </section>

        <aside>
            here is some content
        </aside>
      </article>
    </div>
  );
};

export default TaskEdit;
