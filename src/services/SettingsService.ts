import axios from "axios"

const apiUrl = import.meta.env.VITE_API_URL;
class SettingsService {

    getSettings = async (id:number) =>{
        const response = await axios.get(`${apiUrl}/tenants/${id}`)
        return response.data
    }

    editSettings= async (id: number, settings: any) =>{
        const response = await axios.put(`${apiUrl}/tenants/${id}`, {settings})
        return response.data
    }
}

export const settingsServices = new SettingsService()