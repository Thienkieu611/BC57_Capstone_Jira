import { https } from './config'

export const updateProject = {
    getProjectDetail: () => {
        return https.get(`/api/Project/getProjectDetail?id=14880`)
    },
    putProjectDetail: (id, data) => {
        return https.put(`/api/Project/updateProject?projectId=${id}`, data)
    }
}