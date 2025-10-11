import React, { useState, useEffect } from 'react';
import type { Barber, Service, ShopInfo } from '../types';
import { PencilIcon, TrashIcon, PlusCircleIcon } from './icons';

interface ManagementPanelProps {
    barbers: Barber[];
    services: Service[];
    shopInfo: ShopInfo;
    onAddService: (service: Omit<Service, 'id'>) => void;
    onUpdateService: (service: Service) => void;
    onDeleteService: (id: number) => void;
    onAddBarber: (barber: Omit<Barber, 'id'>) => void;
    onUpdateBarber: (barber: Barber) => void;
    onDeleteBarber: (id: number) => void;
    onUpdateShopInfo: (info: ShopInfo) => void;
}

const ManagementPanel: React.FC<ManagementPanelProps> = ({
    barbers,
    services,
    shopInfo,
    onAddService,
    onUpdateService,
    onDeleteService,
    onAddBarber,
    onUpdateBarber,
    onDeleteBarber,
    onUpdateShopInfo,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState<{
        type: 'service' | 'barber';
        mode: 'add' | 'edit';
        data?: Service | Barber;
    } | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [shopSettings, setShopSettings] = useState<ShopInfo>(shopInfo);

    useEffect(() => {
        setShopSettings(shopInfo);
    }, [shopInfo]);

    useEffect(() => {
        if (modalConfig?.mode === 'edit' && modalConfig.data) {
            setFormData(modalConfig.data);
        } else {
            const defaultData = modalConfig?.type === 'service' 
                ? { name: '', description: '', price: 0, duration: 0 }
                : { name: '', avatarUrl: '' };
            setFormData(defaultData);
        }
    }, [modalConfig]);

    const handleOpenModal = (type: 'service' | 'barber', mode: 'add' | 'edit', data?: Service | Barber) => {
        setModalConfig({ type, mode, data });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalConfig(null);
        setFormData({});
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: (name === 'price' || name === 'duration') ? parseFloat(value) || 0 : value }));
    };
    
    const handleShopSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShopSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!modalConfig) return;

        if (modalConfig.type === 'service') {
            modalConfig.mode === 'add' ? onAddService(formData) : onUpdateService(formData);
        } else {
            modalConfig.mode === 'add' ? onAddBarber(formData) : onUpdateBarber(formData);
        }
        handleCloseModal();
    };
    
    const handleShopSettingsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateShopInfo(shopSettings);
        alert('Configurações da barbearia atualizadas!');
    };

    const handleDelete = (type: 'service' | 'barber', id: number) => {
        const item = type === 'service' ? services.find(s => s.id === id) : barbers.find(b => b.id === id);
        if (window.confirm(`Tem certeza que deseja excluir "${item?.name}"?`)) {
            type === 'service' ? onDeleteService(id) : onDeleteBarber(id);
        }
    };

    const renderModal = () => {
        if (!isModalOpen || !modalConfig) return null;

        const { type, mode } = modalConfig;
        const title = `${mode === 'add' ? 'Adicionar' : 'Editar'} ${type === 'service' ? 'Serviço' : 'Profissional'}`;
        const isService = type === 'service';

        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
                <div className="bg-gray-800 rounded-lg p-6 sm:p-8 w-full max-w-md border border-amber-400">
                    <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 mb-6">{title}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-amber-400 mb-1">Nome</label>
                            <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded" required />
                        </div>
                        {isService ? (
                            <>
                                <div>
                                    <label className="block text-amber-400 mb-1">Descrição</label>
                                    <textarea name="description" value={formData.description || ''} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-amber-400 mb-1">Preço (R$)</label>
                                        <input type="number" name="price" value={formData.price || ''} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded" required />
                                    </div>
                                    <div>
                                        <label className="block text-amber-400 mb-1">Duração (min)</label>
                                        <input type="number" name="duration" value={formData.duration || ''} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded" required />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div>
                                <label className="block text-amber-400 mb-1">URL da Foto</label>
                                <input type="text" name="avatarUrl" value={formData.avatarUrl || ''} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded" required />
                            </div>
                        )}
                        <div className="flex justify-end space-x-4 pt-4">
                            <button type="button" onClick={handleCloseModal} className="bg-gray-600 py-2 px-4 rounded hover:bg-gray-500">Cancelar</button>
                            <button type="submit" className="bg-amber-500 text-black font-bold py-2 px-4 rounded hover:bg-amber-400">Salvar</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-800/50 p-4 sm:p-6 rounded-lg border border-gray-700 space-y-8">
            {renderModal()}
             <div className="pb-6 border-b border-gray-700">
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-white">Configurações da Barbearia</h3>
                <form onSubmit={handleShopSettingsSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="shopName" className="block text-amber-400 mb-1">Nome da Barbearia</label>
                        <input 
                            type="text" 
                            id="shopName"
                            name="name" 
                            value={shopSettings.name} 
                            onChange={handleShopSettingsChange} 
                            className="w-full bg-gray-700 p-2 rounded text-base sm:text-lg" 
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor="logoUrl" className="block text-amber-400 mb-1">URL do Logo (opcional)</label>
                        <input 
                            type="text" 
                            id="logoUrl"
                            name="logoUrl" 
                            value={shopSettings.logoUrl} 
                            onChange={handleShopSettingsChange} 
                            className="w-full bg-gray-700 p-2 rounded text-base sm:text-lg" 
                            placeholder="https://example.com/logo.png"
                        />
                    </div>
                    <div className="text-right">
                        <button type="submit" className="bg-amber-500 text-black font-bold py-2 px-6 rounded-lg hover:bg-amber-400 transition">
                            Salvar Configurações
                        </button>
                    </div>
                </form>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-white border-b border-gray-700 pb-2">Profissionais</h3>
                    <ul className="space-y-2">
                        {barbers.map(barber => (
                            <li key={barber.id} className="bg-gray-700 p-3 rounded-md flex justify-between items-center text-base sm:text-lg">
                                <span>{barber.name}</span>
                                <div className="space-x-3">
                                    <button onClick={() => handleOpenModal('barber', 'edit', barber)} className="text-amber-400 hover:text-amber-300"><PencilIcon className="w-5 h-5"/></button>
                                    <button onClick={() => handleDelete('barber', barber.id)} className="text-red-500 hover:text-red-400"><TrashIcon className="w-5 h-5"/></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => handleOpenModal('barber', 'add')} className="mt-4 w-full flex items-center justify-center space-x-2 bg-amber-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-amber-400 transition">
                        <PlusCircleIcon className="w-6 h-6"/>
                        <span>Adicionar Profissional</span>
                    </button>
                </div>
                <div>
                    <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-white border-b border-gray-700 pb-2">Serviços</h3>
                    <ul className="space-y-2">
                        {services.map(service => (
                            <li key={service.id} className="bg-gray-700 p-3 rounded-md flex justify-between items-center text-base sm:text-lg">
                                <span>{service.name} - R$ {service.price.toFixed(2)}</span>
                                <div className="space-x-3">
                                     <button onClick={() => handleOpenModal('service', 'edit', service)} className="text-amber-400 hover:text-amber-300"><PencilIcon className="w-5 h-5"/></button>
                                     <button onClick={() => handleDelete('service', service.id)} className="text-red-500 hover:text-red-400"><TrashIcon className="w-5 h-5"/></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => handleOpenModal('service', 'add')} className="mt-4 w-full flex items-center justify-center space-x-2 bg-amber-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-amber-400 transition">
                       <PlusCircleIcon className="w-6 h-6"/>
                       <span>Adicionar Serviço</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManagementPanel;