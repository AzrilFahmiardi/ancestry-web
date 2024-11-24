import { useNavigate } from "react-router-dom";

function TreeCard({ family, onDelete }) {
    const navigate = useNavigate();

    const handleClick = (e) => {
        // Prevent navigation if clicking delete button
        if (e.target.closest('.delete-btn')) return;
        navigate(`/family/${family.id}`);
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this family tree?')) {
            await onDelete(family.id);
        }
    };

    return (
        <div className="w-[250px] h-[150px] bg-green-gradient rounded-xl cursor-pointer px-5 py-5 hover:bg-green-gradient-2">
            <p className="text-[051923] font-bold font-Poppins text-[1.2em]">{family.name}</p>
            <p className="text-[051923] font-light font-Poppins text-[0.7em] mt-1 mb-6">
                Created: {new Date(family.created_at).toLocaleDateString()}
            </p>
            <div className="flex gap-2">
                <button
                    className="text-white bg-[#5E60CE] font-Poppins font-bold text-[0.9em] px-6 py-1 rounded-md hover:bg-[#1d1e63c2]"
                    onClick={() => navigate(`/family/${family.id}`)}
                >
                    SEE
                </button>
                <button className="text-white bg-[#CF3742] font-Poppins font-bold text-[0.9em] px-2 py-1 rounded-md hover:bg-[#861b22]"
                    onClick={handleDelete}
                >
                    DELETE
                </button>
            </div>
        </div>
    );
}

export default TreeCard;
