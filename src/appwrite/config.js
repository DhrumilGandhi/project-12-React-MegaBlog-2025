import { Client, Databases, ID, Storage, Query } from 'appwrite';
import conf from '../config/conf';
import { retry } from '@reduxjs/toolkit/query';

export class DatabaseService {

    client = new Client();
    databases;
    bucket;

    constructor () {
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost ({ title, slug, content, featuredImage, status, userId }) {
        try {
            return await this.databases.createDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug, {
                title,
                content,
                featuredImage,
                status,
                userId
            });

        } catch (error) {
            console.log('Appwrite Error', error); 
        }
    }

    async updatePost(slug, { title, content, featuredImage, status, userId }) {
        try {
            return await this.databases.updateDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug, {
                title,
                content,
                featuredImage,
                status,
                userId
            }
        )
        } catch (error) {
            console.log('Appwrite Error', error);
        }
    }

    async deletePost (slug ) {
        try {
            await this.databases.deleteDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug);
            return true;
        } catch (error) {
            console.log('Appwrite Error', error);
            return false;
        }
    }

    async getPost(slug) {
        try {
            await this.databases.getDocument(conf.appwriteDatabaseId, conf.appwriteCollectionId, slug);
            return true;
        } catch (error) {
            console.log('Appwrite Error', error);
            return false;
        }
    }

    async getPosts() {
        try {
            return await this.databases.listDocuments(conf.appwriteDatabaseId, conf.appwriteCollectionId,
                [Query.equal('status','active')]
            )
        } catch (error) {
            console.log('Appwrite Error', error);
            return false
        }
    }

    // File Upload

    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log('Appwrite Error', error);
            return false;
        }
    }

    async deleteFile (fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            );
            return true;
        } catch (error) {
            console.log('Appwrite Error', error);
            return false;
        }
    }

    getFilePreview(fileId) {
        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId
        )
    }
}

const databaseService =  new DatabaseService();
export default databaseService;