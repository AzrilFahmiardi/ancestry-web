// familyTreeService.js
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
            const response = await this.api.post('/family-member', memberData);
            return response.data;
        } catch (error) {
            console.error('Error adding family member:', error);
            throw new Error('Failed to add family member');
        }
    }

    // Update family member
    async updateFamilyMember(id, memberData) {
        try {
            const response = await this.api.put(`/family-member/${id}`, memberData);
            return response.data;
        } catch (error) {
            console.error('Error updating family member:', error);
            throw new Error('Failed to update family member');
        }
    }

    // Delete family member
    async deleteFamilyMember(id) {
        try {
            const response = await this.api.delete(`/family-member/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting family member:', error);
            throw new Error('Failed to delete family member');
        }
    }
}

export const familyTreeService = new FamilyTreeService();