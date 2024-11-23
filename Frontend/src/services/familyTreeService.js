import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

class FamilyTreeService {
    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async getAllTrees() {
        try {
            const response = await this.api.get('/trees');
            return response.data;
        } catch (error) {
            console.error('Error fetching trees:', error);
            throw new Error('Failed to fetch family trees');
        }
    }

    async createTree(name) {
        try {
            const response = await this.api.post('/trees', { name });
            return response.data;
        } catch (error) {
            console.error('Error creating family tree:', error);
            throw new Error('Failed to create family tree');
        }
    }

    // Fetch family tree data
    async getFamilyTree(treeId) {
        try {
            const response = await this.api.get(`/treedata/${treeId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching family tree:', error);
            throw new Error('Failed to fetch family tree data');
        }
    }

    // Add new family member
    async addFamilyMember(memberData) {
        try {
            const response = await this.api.post('/family', {
                ...memberData,
                treeId: memberData.treeId
            });
            return response.data;
        } catch (error) {
            console.error('Error adding family member:', error);
            throw new Error('Failed to add family member');
        }
    }

    // Update family member
    async updateFamilyMember(id, memberData, isSpouse = false) {
        try {
            console.log('Updating member:', { id, memberData, isSpouse });
            const response = await this.api.put(`/family/${id}`, {
                ...memberData,
                isSpouse  // Pass the isSpouse flag to the backend
            });
            return response.data;
        } catch (error) {
            console.error('Error updating family member:', error);
            throw new Error('Failed to update family member');
        }
    }

    // Delete family member
    async deleteFamilyMember(id) {
        try {
            const response = await this.api.delete(`/family/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting family member:', error);
            throw new Error('Failed to delete family member');
        }
    }

    // Add spouse to a family member
    async addSpouse(mainMemberId, spouseData) {
        try {
            // Add spouse first, then link to main member
            const spouseResponse = await this.api.post('/family', {
                ...spouseData,
                spouseId: mainMemberId
            });
            return spouseResponse.data;
        } catch (error) {
            console.error('Error adding spouse:', error);
            throw new Error('Failed to add spouse');
        }
    }
}

export const familyTreeService = new FamilyTreeService();