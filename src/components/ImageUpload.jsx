import { useRef } from 'react';
import { useImageUpload } from '../hooks/useImageUpload';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

const ImageUpload = ({ value, onChange, label = "Upload Image", bucket = 'menu-images' }) => {
    const fileInputRef = useRef(null);
    const { uploadImage, uploading, uploadProgress } = useImageUpload(bucket);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const publicUrl = await uploadImage(file);
            onChange(publicUrl);
        } catch (error) {
            alert(error.message || 'Failed to upload image');
        } finally {
            // Reset input so the same file can be selected again if needed
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeImage = (e) => {
        e.stopPropagation();
        onChange('');
    };

    return (
        <div className="space-y-2">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">{label}</label>
            <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`relative group cursor-pointer border-2 border-dashed rounded-2xl overflow-hidden transition-all h-48 flex flex-col items-center justify-center bg-gray-50
                    ${uploading ? 'border-brand-primary' : 'border-gray-200 hover:border-brand-accent hover:bg-white'}
                    ${value ? 'border-solid border-transparent' : ''}
                `}
            >
                {value ? (
                    <>
                        <img src={value} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-black uppercase tracking-widest">Change Image</span>
                        </div>
                        <button
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg shadow-black/20"
                        >
                            <X size={14} />
                        </button>
                    </>
                ) : uploading ? (
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
                        <div className="w-32 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                                className="bg-brand-primary h-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                        <span className="text-[10px] font-black text-brand-primary uppercase tracking-tighter">Uploading... {uploadProgress}%</span>
                    </div>
                ) : (
                    <>
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-brand-accent group-hover:scale-110 transition-all">
                            <Upload size={20} />
                        </div>
                        <div className="mt-3 text-center px-4">
                            <p className="text-sm font-bold text-gray-600">Click to upload image</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                        </div>
                    </>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
            </div>
        </div>
    );
};

export default ImageUpload;
