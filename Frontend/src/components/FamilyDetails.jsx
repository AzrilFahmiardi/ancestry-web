import { useParams, useNavigate } from "react-router-dom";
import FamilyTree from './FamilyTree';
import { useEffect, useState } from "react";
import { familyTreeService } from "../services/familyTreeService";
import bgGrid from '../assets/grid.png';
import bgGrid2 from '../assets/grid2.svg';
import home from '../assets/Home.svg';

function FamilyDetails() {
    const { id } = useParams();
    const [family, setFamily] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getFamily();
    }, []);

    const getFamily = async () => {
        try {
            const data = await familyTreeService.getAllTrees();
            const filteredFamily = data?.find(tree => tree.id === parseInt(id)) || {};
            setFamily(filteredFamily);
        } catch (error) {
            console.error('Error fetching family', error);
        }
    };

    return (
        <>
            <div
                className="w-full h-full bg-cover bg-center bg-green-gradient-3"
            >
                <div className="fixed w-[400px] h-[70px] bg-white top-5 left-5 rounded-full shadow-2xl px-10 flex justify-between items-center">
                    <p className="font-montserrat font-bold">{family.name}</p>
                    <button onClick={() => navigate(`/`)}>
                        <img src={home} alt="home" />
                    </button>
                </div>
                <FamilyTree treeId={id} />
            </div>
        </>
    );
}

export default FamilyDetails;
