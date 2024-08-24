import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getTodos,
  updateTodo,
  addTodo,
  deleteTodo,
} from "../features/auth/todoSlice";
import { useAppDispatch } from "../app/hook";
import { toast } from "react-toastify";

export default function Todo() {
  const [searchValue, setSearchValue] = useState("");
  const [formData, setFormData] = useState({ text: "", id: null });
  const [isEditing, setIsEditing] = useState(false);

  const dispatch = useAppDispatch();

  // Access the todos inside the `todos` key
  const { items, loading, error } = useSelector((state) => state.todos);

  useEffect(() => {
    dispatch(getTodos());
  }, [dispatch]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.text.trim()) {
      toast.error("Todo text cannot be empty");
      return;
    }

    if (isEditing) {
      dispatch(updateTodo(formData));
      toast.success("Todo updated successfully");
      dispatch(getTodos());
    } else {
      const newTodo = {
        ...formData,
        id: Date.now().toString(),
        isCompleted: false,
      };
      dispatch(addTodo(newTodo));
      toast.success("Todo added successfully");
      dispatch(getTodos());
    }

    setFormData({ text: "", id: null });
    setIsEditing(false);
  };

  // Handle edit
  const handleEdit = (todo) => {
    setFormData({ text: todo.text, id: todo.id, isCompleted: todo.isCompleted });
    setIsEditing(true);
  };

  // Handle delete
  const handleDelete = (id) => {
    dispatch(deleteTodo(id));
    toast.success("Todo deleted successfully");
    dispatch(getTodos());

  };

  // View details (Optional inline or modal)
  const handleViewDetails = (todo) => {
    toast.info(`Todo details: ${todo.text}, Completed: ${todo.isCompleted}`);
  };

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error if there is any
  if (error) {
    toast.error(error);
    return <div>{error}</div>;
  }

  return (
    <>
      <div>
        <input
          value={searchValue}
          type="text"
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <h1 className="text-blue-500">Manage your Todo items</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="border"
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            placeholder="Enter todo"
          />
          <button type="submit" className="bg-black px-2 py-1 text-white ml-2">
            {isEditing ? "Update" : "Add"}
          </button>
        </form>

        <div className="flex flex-col mt-8">
          {items.length > 0 ? (
            items
              .filter((items) => {
                return searchValue.toLocaleLowerCase() === ""
                  ? items
                  : items.text.toLocaleLowerCase().includes(searchValue);
              })
              .map((todo, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center"
                >
                  <span>{todo.text}</span>
                  <span>
                    <button
                      className="bg-yellow-500 py-1 px-2 text-white mr-2"
                      onClick={() => handleViewDetails(todo)}
                    >
                      View
                    </button>
                    <button
                      className="bg-blue-500 py-1 px-2 text-white mr-2"
                      onClick={() => handleEdit(todo)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 py-1 px-2 text-white"
                      onClick={() => handleDelete(todo.id)}
                    >
                      Delete
                    </button>
                  </span>
                </div>
              ))
          ) : (
            <p>No todo list to display</p>
          )}
        </div>
      </div>
    </>
  );
}
