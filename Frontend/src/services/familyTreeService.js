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

    // Fetch family tree data
    async getFamilyTree() {
        try {
            const response = await this.api.get('/treedata');
            return response.data;
        } catch (error) {
            console.error('Error fetching family tree:', error);
            throw new Error('Failed to fetch family tree data');
        }
    }

    // Add new family member
    async addFamilyMember(memberData) {
        try {
            const response = await this.api.post('/family', memberData);
            return response.data;
        } catch (error) {
            console.error('Error adding family member:', error);
            throw new Error('Failed to add family member');
        }
    }

    // Update family member
    async updateFamilyMember(id, memberData) {
        try {
            const response = await this.api.put(`/family/${id}`, memberData);
            
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