import { useState, useEffect } from 'react';
import { SuperAdminApi } from '@/services/SuperAdminApi';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const AssessmentKitsManager = () => {
    const [institutions, setInstitutions] = useState<any[]>([]);
    const [selectedInstitution, setSelectedInstitution] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Company Kit Form
    const [companyName, setCompanyName] = useState('');
    const [companyTier, setCompanyTier] = useState('Startup');
    
    // Coding Problem Form
    const [problemTitle, setProblemTitle] = useState('');
    const [problemDifficulty, setProblemDifficulty] = useState('Medium');
    const [problemUrl, setProblemUrl] = useState('');
    const [targetCompanyId, setTargetCompanyId] = useState('');

    useEffect(() => {
        fetchInstitutions();
    }, []);

    const fetchInstitutions = async () => {
        try {
            const data = await SuperAdminApi.listInstitutions();
            setInstitutions(data);
        } catch (error) {
            toast.error("Failed to load institutions");
        }
    };

    const handleCreateCompanyKit = async () => {
        if (!selectedInstitution || !companyName) {
            toast.error("Please select an institution and enter a company name");
            return;
        }
        try {
            setLoading(true);
            const res = await SuperAdminApi.createCompanyKit({
                institution_id: parseInt(selectedInstitution),
                name: companyName,
                tier: companyTier,
            });
            toast.success("Company kit created successfully!");
            setCompanyName('');
            if (!targetCompanyId) {
                setTargetCompanyId(res.id);
            }
        } catch (error) {
            toast.error("Failed to create company kit");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProblem = async () => {
        if (!selectedInstitution || !problemTitle) {
            toast.error("Please select an institution and enter a problem title");
            return;
        }
        try {
            setLoading(true);
            await SuperAdminApi.createCodingProblem({
                institution_id: parseInt(selectedInstitution),
                company_id: targetCompanyId,
                title: problemTitle,
                difficulty: problemDifficulty,
                url: problemUrl,
            });
            toast.success("Coding problem created successfully!");
            setProblemTitle('');
            setProblemUrl('');
        } catch (error) {
            toast.error("Failed to create coding problem");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Select Target Institution</h2>
                <select 
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                    value={selectedInstitution}
                    onChange={(e) => setSelectedInstitution(e.target.value)}
                >
                    <option value="">-- Select Institution --</option>
                    {institutions.map(inst => (
                        <option key={inst.id} value={inst.id}>{inst.name} ({inst.code})</option>
                    ))}
                </select>
                <p className="text-xs text-muted-foreground mt-2">
                    Assessment kits and coding problems created here will only be visible to students of the selected institution.
                </p>
            </div>

            {selectedInstitution && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Add Company Kit */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Add Company Kit</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Company Name</label>
                                <input 
                                    type="text" 
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="e.g. Local Tech Solutions"
                                    className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Tier</label>
                                <select 
                                    value={companyTier}
                                    onChange={(e) => setCompanyTier(e.target.value)}
                                    className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                                >
                                    <option value="FAANG">FAANG</option>
                                    <option value="Product">Product</option>
                                    <option value="Service">Service</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Startup">Startup</option>
                                </select>
                            </div>
                            <Button onClick={handleCreateCompanyKit} disabled={loading || !companyName} className="w-full">
                                Create Company Kit
                            </Button>
                        </div>
                    </div>

                    {/* Add Coding Problem */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Add Coding Problem</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Map to Company ID (Optional)</label>
                                <input 
                                    type="text" 
                                    value={targetCompanyId}
                                    onChange={(e) => setTargetCompanyId(e.target.value)}
                                    placeholder="e.g. local-tech-solutions"
                                    className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                                />
                                <p className="text-xs text-muted-foreground mt-1">If empty, problem is unmapped.</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Problem Title</label>
                                <input 
                                    type="text" 
                                    value={problemTitle}
                                    onChange={(e) => setProblemTitle(e.target.value)}
                                    placeholder="e.g. Two Sum Custom"
                                    className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">URL (Optional)</label>
                                <input 
                                    type="text" 
                                    value={problemUrl}
                                    onChange={(e) => setProblemUrl(e.target.value)}
                                    placeholder="e.g. https://leetcode.com/problems/..."
                                    className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Difficulty</label>
                                <select 
                                    value={problemDifficulty}
                                    onChange={(e) => setProblemDifficulty(e.target.value)}
                                    className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>
                            <Button onClick={handleCreateProblem} disabled={loading || !problemTitle} className="w-full">
                                Create Coding Problem
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
