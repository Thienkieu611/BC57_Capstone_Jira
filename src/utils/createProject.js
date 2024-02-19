import { https } from './config'

export const createProject = {
    getCategory: () => {
        return https.get('/api/ProjectCategory')
    },
    postData: (data) => {
        return https.post('/api/Project/createProject', data)
    }
}