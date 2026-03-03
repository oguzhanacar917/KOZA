import React, { useState } from 'react';
import { User, Bell, Settings, Star, Heart, Share2, MoreHorizontal, Calendar, Activity, Zap, Check, AlertTriangle, X, Map } from 'lucide-react';
import GalaxyContainer from '../components/galaxy/GalaxyContainer';
import GalaxyPaper from '../components/galaxy/GalaxyPaper';
import GalaxyGrid from '../components/galaxy/GalaxyGrid';
import GalaxyDivider from '../components/galaxy/GalaxyDivider';
import GalaxyButton from '../components/galaxy/GalaxyButton';
import GalaxyInput from '../components/galaxy/GalaxyInput';
import GalaxyCard from '../components/galaxy/GalaxyCard';

// Phase 1: Inputs
import GalaxyToggle from '../components/galaxy/GalaxyToggle';
import GalaxyCheckbox from '../components/galaxy/GalaxyCheckbox';
import GalaxyRadio from '../components/galaxy/GalaxyRadio';
import GalaxySlider from '../components/galaxy/GalaxySlider';
import GalaxyRange from '../components/galaxy/GalaxyRange';
import GalaxyTextarea from '../components/galaxy/GalaxyTextarea';
import GalaxySelect from '../components/galaxy/GalaxySelect';
import GalaxyColorPicker from '../components/galaxy/GalaxyColorPicker';
import GalaxyFileUploader from '../components/galaxy/GalaxyFileUploader';
import GalaxyRating from '../components/galaxy/GalaxyRating';

// Phase 2: Feedback
import GalaxyToast from '../components/galaxy/GalaxyToast';
import GalaxyModal from '../components/galaxy/GalaxyModal';
import GalaxyTooltip from '../components/galaxy/GalaxyTooltip';
import GalaxyAlert from '../components/galaxy/GalaxyAlert';
import GalaxyProgress from '../components/galaxy/GalaxyProgress';
import GalaxySpinner from '../components/galaxy/GalaxySpinner';
import GalaxySkeleton from '../components/galaxy/GalaxySkeleton';
import GalaxyBackdrop from '../components/galaxy/GalaxyBackdrop';
import GalaxyDrawer from '../components/galaxy/GalaxyDrawer';
import GalaxyDialog from '../components/galaxy/GalaxyDialog';

// Phase 3: Data Display
import GalaxyAvatar from '../components/galaxy/GalaxyAvatar';
import GalaxyBadge from '../components/galaxy/GalaxyBadge';
import GalaxyTag from '../components/galaxy/GalaxyTag';
import GalaxyChip from '../components/galaxy/GalaxyChip';
import { GalaxyList, GalaxyListItem } from '../components/galaxy/GalaxyList';
import GalaxyTable from '../components/galaxy/GalaxyTable';
import GalaxyQuote from '../components/galaxy/GalaxyQuote';
import GalaxyCode from '../components/galaxy/GalaxyCode';
import GalaxyStat from '../components/galaxy/GalaxyStat';
import GalaxyTimeline from '../components/galaxy/GalaxyTimeline';

// Phase 4: Navigation
import GalaxyTabs from '../components/galaxy/GalaxyTabs';
import GalaxyAccordion from '../components/galaxy/GalaxyAccordion';
import GalaxyBreadcrumb from '../components/galaxy/GalaxyBreadcrumb';
import GalaxyPagination from '../components/galaxy/GalaxyPagination';
import GalaxyStepper from '../components/galaxy/GalaxyStepper';
import GalaxyLink from '../components/galaxy/GalaxyLink';

const GalaxyLabTab = () => {
    // State for interactive components
    const [toggle, setToggle] = useState(false);
    const [check, setCheck] = useState(false);
    const [radio, setRadio] = useState('1');
    const [slider, setSlider] = useState(50);
    const [range, setRange] = useState([20, 80]);
    const [text, setText] = useState('');
    const [select, setSelect] = useState('option1');
    const [color, setColor] = useState('#9333ea');
    const [rating, setRating] = useState(3);
    const [modalOpen, setModalOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('inputs');
    const [page, setPage] = useState(1);
    const [tags, setTags] = useState(['React', 'Galaxy', 'UI']);
    const [chip, setChip] = useState('design');

    return (
        <div className="min-h-screen p-8 pb-32">
            <GalaxyContainer>
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 mb-4 animate-float">
                        Galaxy Bileşen Laboratuvarı
                    </h1>
                    <p className="text-neutral-500">40'tan Fazla Premium Glassmorphic Bileşen Sergisi</p>
                </div>

                <GalaxyTabs
                    className="mb-8 mx-auto block w-fit"
                    activeTab={activeTab}
                    onChange={setActiveTab}
                    tabs={[
                        { id: 'inputs', label: 'Girdiler', icon: Zap },
                        { id: 'feedback', label: 'Geri Bildirim', icon: Bell },
                        { id: 'data', label: 'Veri', icon: Activity },
                        { id: 'nav', label: 'Gezinti', icon: Map }
                    ]}
                />

                {activeTab === 'inputs' && (
                    <div className="space-y-8 animate-fade-in">
                        <GalaxyPaper elevation={2}>
                            <h2 className="text-2xl font-bold mb-6 text-neutral-800">Form Kontrolleri</h2>
                            <GalaxyGrid cols={2}>
                                <div className="space-y-4">
                                    <GalaxyToggle checked={toggle} onChange={setToggle} />
                                    <GalaxyCheckbox label="Likit Onay Kutusu" checked={check} onChange={setCheck} />
                                    <div className="flex gap-4">
                                        <GalaxyRadio name="g-radio" value="1" label="Seçenek A" checked={radio === '1'} onChange={setRadio} />
                                        <GalaxyRadio name="g-radio" value="2" label="Seçenek B" checked={radio === '2'} onChange={setRadio} />
                                    </div>
                                    <GalaxyRating value={rating} onChange={setRating} />
                                </div>
                                <div className="space-y-4">
                                    <GalaxyInput placeholder="Standart Girdi" />
                                    <GalaxySelect
                                        value={select}
                                        onChange={setSelect}
                                        options={[
                                            { value: 'option1', label: 'Cam Seçenek 1' },
                                            { value: 'option2', label: 'Cam Seçenek 2' },
                                            { value: 'option3', label: 'Cam Seçenek 3' }
                                        ]}
                                    />
                                    <GalaxyColorPicker value={color} onChange={setColor} label="Vurgu Rengi" />
                                </div>
                            </GalaxyGrid>
                            <GalaxyDivider />
                            <GalaxyGrid cols={2}>
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-neutral-500 uppercase">Aralık Sürgüsü</label>
                                    <GalaxySlider value={slider} onChange={setSlider} />
                                    <GalaxyRange value={range} onChange={setRange} />
                                </div>
                                <div>
                                    <GalaxyTextarea placeholder="Sihirli bir şeyler yazın..." value={text} onChange={setText} />
                                </div>
                            </GalaxyGrid>
                            <div className="mt-8">
                                <GalaxyFileUploader />
                            </div>
                        </GalaxyPaper>
                    </div>
                )}

                {activeTab === 'feedback' && (
                    <div className="space-y-8 animate-fade-in">
                        <GalaxyGrid cols={2}>
                            <GalaxyPaper>
                                <h3 className="text-lg font-bold mb-4">Uyarılar</h3>
                                <div className="space-y-4">
                                    <GalaxyAlert type="info" title="Bilgi">Bu bir cam uyarıdır.</GalaxyAlert>
                                    <GalaxyAlert type="success" title="Başarı">İşlem başarıyla tamamlandı.</GalaxyAlert>
                                </div>
                            </GalaxyPaper>
                            <GalaxyPaper>
                                <h3 className="text-lg font-bold mb-4">Yükleme Durumları</h3>
                                <div className="flex items-center gap-8 justify-center py-8">
                                    <GalaxySpinner size="small" />
                                    <GalaxySpinner size="medium" />
                                    <GalaxySpinner size="large" />
                                </div>
                                <div className="space-y-2 mt-4">
                                    <GalaxySkeleton width="100%" height="20px" />
                                    <GalaxySkeleton width="70%" height="20px" />
                                </div>
                            </GalaxyPaper>
                        </GalaxyGrid>

                        <GalaxyPaper>
                            <h3 className="text-lg font-bold mb-4">Katmanlar</h3>
                            <div className="flex gap-4">
                                <GalaxyButton onClick={() => setModalOpen(true)}>Modeli Aç</GalaxyButton>
                                <GalaxyButton variant="secondary" onClick={() => setDrawerOpen(true)}>Çekmeceyi Aç</GalaxyButton>
                                <GalaxyTooltip content="Yüzüyorum!">
                                    <GalaxyButton variant="secondary">Üzerime Gel</GalaxyButton>
                                </GalaxyTooltip>
                            </div>
                        </GalaxyPaper>

                        <GalaxyPaper>
                            <h3 className="text-lg font-bold mb-4">İlerleme</h3>
                            <GalaxyProgress value={slider} className="mb-4" />
                            <GalaxyProgress value={75} size="small" />
                        </GalaxyPaper>
                    </div>
                )}

                {activeTab === 'data' && (
                    <div className="space-y-8 animate-fade-in">
                        <GalaxyGrid cols={3}>
                            <GalaxyStat label="Toplam Yıldız" value={1234} icon={Star} />
                            <GalaxyStat label="Aktif Kullanıcılar" value={856} icon={User} suffix="k" />
                            <GalaxyStat label="SİSTEM DURUMU" value="99.9" icon={Activity} suffix="%" />
                        </GalaxyGrid>

                        <GalaxyPaper>
                            <div className="flex gap-4 items-center mb-6">
                                <GalaxyAvatar size="xlarge" src="https://i.pravatar.cc/150?img=32" status="online" />
                                <div>
                                    <h3 className="text-2xl font-bold">Dr. Galaxy</h3>
                                    <div className="flex gap-2 mt-2">
                                        <GalaxyBadge variant="success">Yönetici</GalaxyBadge>
                                        <GalaxyBadge variant="primary" icon={Star}>Pro</GalaxyBadge>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 mb-6">
                                {tags.map(tag => (
                                    <GalaxyTag key={tag} label={tag} onRemove={() => setTags(tags.filter(t => t !== tag))} />
                                ))}
                                <GalaxyChip label="Design" active={chip === 'design'} onClick={() => setChip('design')} />
                                <GalaxyChip label="Code" active={chip === 'code'} onClick={() => setChip('code')} />
                            </div>
                            <GalaxyQuote author="Albert Einstein">
                                "Imagination is more important than knowledge."
                            </GalaxyQuote>
                        </GalaxyPaper>

                        <GalaxyGrid cols={2}>
                            <GalaxyPaper>
                                <GalaxyList>
                                    <GalaxyListItem title="Bildirim 1" subtitle="Şimdi" icon={Bell} />
                                    <GalaxyListItem title="Yeni Mesaj" subtitle="2 dk önce" icon={User} />
                                    <GalaxyListItem title="Sistem Güncellemesi" subtitle="1 saat önce" icon={Settings} />
                                </GalaxyList>
                            </GalaxyPaper>
                            <GalaxyPaper>
                                <GalaxyTimeline items={[
                                    { date: '2024', title: 'Phase 1', description: 'Started the journey' },
                                    { date: '2025', title: 'Phase 2', description: 'Launched into space' },
                                    { date: '2026', title: 'Phase 3', description: 'Reached the stars' }
                                ]} />
                            </GalaxyPaper>
                        </GalaxyGrid>

                        <GalaxyCode language="javascript" code={`const galaxy = "limitless";\nfunction explore() {\n  return galaxy.expand();\n}`} />
                    </div>
                )}

                {activeTab === 'nav' && (
                    <div className="space-y-8 animate-fade-in">
                        <GalaxyPaper>
                            <GalaxyBreadcrumb items={[
                                { id: 'home', label: 'Ana Sayfa' },
                                { id: 'components', label: 'Bileşenler' },
                                { id: 'lab', label: 'Laboratuvar' }
                            ]} />
                            <GalaxyDivider />
                            <GalaxyStepper steps={['Design', 'Build', 'Launch']} currentStep={1} />
                            <GalaxyDivider />
                            <div className="flex justify-center">
                                <GalaxyPagination currentPage={page} totalPages={5} onPageChange={setPage} />
                            </div>
                        </GalaxyPaper>

                        <GalaxyAccordion items={[
                            { title: 'Galaxy nedir?', content: 'Galaxy, premium bir glassmorphic bileşen sistemidir.' },
                            { title: 'Nasıl kullanırım?', content: 'Sadece bileşenleri içe aktarın ve güzelliğin tadını çıkarın.' },
                            { title: 'Hızlı mı?', content: 'Evet, donanım hızlandırmalı CSS animasyonları ile desteklenmektedir.' }
                        ]} />
                    </div>
                )}
            </GalaxyContainer>

            {/* Modals & Drawers */}
            <GalaxyModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Galaxy Modeli">
                <p>Bu bulanık arka planlı bir modeldir. Çok premium görünür.</p>
            </GalaxyModal>

            <GalaxyDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Galaxy Çekmecesi">
                <p>Yan paneller, ekstra ayarlar veya detaylar için harikadır.</p>
            </GalaxyDrawer>
        </div>
    );
};

export default GalaxyLabTab;
