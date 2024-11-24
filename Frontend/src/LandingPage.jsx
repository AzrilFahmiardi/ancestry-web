import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import arrow from './assets/arrow.png';
import TreeCard from './components/TreeCard';
import { familyTreeService } from './services/familyTreeService';

function LandingPage() {
    const navigate = useNavigate();
    const [family, setFamily] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [formData, setFormData] = useState({
        familyName: '',
        ancestorName: '',
        dob: '',
        status: 'hidup'
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadFamily();
    }, []);

    useEffect(() => {
        const debounceSearch = setTimeout(() => {
            if (searchTerm) {
                handleSearch();
            } else {
                loadFamily();
            }
        }, 300);

        return () => clearTimeout(debounceSearch);
    }, [searchTerm]);

    const handleSearch = async () => {
        setIsSearching(true);
        try {
            const results = await familyTreeService.searchTrees(searchTerm);
            setFamily(results);
        } catch (error) {
            console.error("Error searching family trees:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleDelete = async (treeId) => {
        try {
            await familyTreeService.deleteTree(treeId);
            // Refresh the list after deletion
            await loadFamily();
        } catch (error) {
            console.error("Error deleting family tree:", error);
        }
    };

    const loadFamily = async () => {
        try {
            const data = await familyTreeService.getAllTrees();
            setFamily(data);
        } catch (error) {
            console.error("Error fetching family trees:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // First, create the family tree
            const treeResponse = await familyTreeService.createTree(formData.familyName);
            const treeId = treeResponse.id;

            // Then, add the ancestor as the first family member
            await familyTreeService.addFamilyMember({
                name: formData.ancestorName,
                dob: formData.dob,
                status: formData.status,
                treeId: treeId
            });

            // Refresh the family list
            await loadFamily();
            
            // Close the form
            setShowForm(false);
            
            // Reset form data
            setFormData({
                familyName: '',
                ancestorName: '',
                dob: '',
                status: 'hidup'
            });

            // Navigate to the new family tree
            navigate(`/family/${treeId}`);
        } catch (error) {
            console.error('Error creating family tree:', error);
            // Here you might want to add error handling UI
        } finally {
            setIsLoading(false);
        }
    };

    const familyForm = () => {
        return (
            <div className='fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center'>
                <div className='bg-white rounded-lg shadow-lg w-full max-w-md p-6'>
                    <h2 className='text-xl font-semibold mb-4 text-center text-[#2a2a2a]'>Add Family</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                name="familyName"
                                value={formData.familyName}
                                onChange={handleChange}
                                placeholder='Family Name'
                                className='w-full px-4 py-2 border border-[#ccc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E60CE]'
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                name="ancestorName"
                                value={formData.ancestorName}
                                onChange={handleChange}
                                placeholder='Ancestor Name'
                                className='w-full px-4 py-2 border border-[#ccc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E60CE]'
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className='w-full px-4 py-2 border border-[#ccc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E60CE]'
                                required
                            />
                        </div>
                        <div className="flex gap-6">
                            <label className="flex items-center text-gray-700">
                                <input 
                                    type="radio" 
                                    name="status"
                                    value="hidup"
                                    checked={formData.status === 'hidup'}
                                    onChange={handleChange}
                                    className="mr-2" 
                                />
                                Hidup
                            </label>
                            <label className="flex items-center text-gray-700">
                                <input 
                                    type="radio" 
                                    name="status"
                                    value="deceased"
                                    checked={formData.status === 'deceased'}
                                    onChange={handleChange}
                                    className="mr-2" 
                                />
                                Mati
                            </label>
                        </div>
                        <div className="flex justify-center mt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className='w-full py-2 bg-[#5E60CE] text-white rounded-lg hover:bg-[#5e60ceaf] transition duration-300 disabled:opacity-50'
                            >
                                {isLoading ? 'Creating...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div className='w-full h-[100vh] bg-blue-black-gradient grid grid-cols-2'>
            <div className="font-Poppins relative">
                <h1 className="absolute top-[200px] left-[150px] font-bold text-[4em] text-white">FamTrees</h1>
                <p className="absolute top-[280px] left-[155px] text-white font-montserrat">by Azril Fahmiardi</p>
                <p className="absolute top-[380px] left-[155px] font-light w-[600px] text-[1.3rem] text-[#ffffffa2]">
                    Famtrees adalah aplikasi yang membantu anda mengorganisir hubungan keluarga anda.
                </p>
                <button className="flex gap-7 absolute top-[550px] left-[155px] text-[1.4em] text-white px-10 py-6 rounded-full border-2 border-[#5E60CE] hover:bg-[#5e60ce60]"
                onClick={() => setShowForm(true)}>
                    GET STARTED
                    <img src={arrow} alt="arrow" />
                </button>
            </div>
            <div className='relative'>
                <div className='absolute top-[280px] left-[50px] flex gap-6 font-Poppins'>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder='search family tree'
                        className='border-[#0466C8] border-[2px] bg-transparent rounded-full px-7 py-2 w-[20em] text-white'
                    />
                    <button
                        onClick={() => setShowForm(true)}
                        className='text-white bg-[#5E60CE] px-5 py-2 rounded-xl hover:bg-[#5e60ceaf]'
                    >
                        Add Family Tree
                    </button>
                </div>
                <div className='flex gap-5 flex-wrap absolute top-[380px] left-[50px] w-[45vw]'>
                    {isSearching ? (
                        <p className="text-white">Searching...</p>
                    ) : family.length === 0 ? (
                        <p className="text-white">No family trees found</p>
                    ) : (
                        family.map((item) => (
                            <TreeCard 
                                key={item.id} 
                                family={item} 
                                onDelete={handleDelete}
                            />
                        ))
                    )}
                </div>
            </div>

            {showForm && familyForm()}
        </div>
    );
}

export default LandingPage;