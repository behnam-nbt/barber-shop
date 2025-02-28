import { useMutation } from "@tanstack/react-query";
import api from "@/api/api";

export const useSendOtp = () => {
    const mutationFn = (data) => api.post('/api/send-otp', data);
    return useMutation({ mutationFn });
}

export const useCheckOtp = () => {
    const mutationFn = (data) => api.post("api/check-otp", data);

    return useMutation({ mutationFn });
};  