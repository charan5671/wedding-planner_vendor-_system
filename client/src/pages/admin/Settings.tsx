import { useState } from 'react';
import { Button } from '../../components/Button';

export function AdminSettings() {
    const [settings, setSettings] = useState({
        platformName: 'Bliss Wedding Planner',
        contactEmail: 'admin@bliss.com',
        maintenanceMode: false,
        allowVendorRegistration: true
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);
        alert('Settings saved successfully!');
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Platform Settings</h2>
                <p className="text-slate-500 mt-1">Configure general platform options and details.</p>
            </div>

            <div className="bg-white shadow-sm border border-slate-200 rounded-lg p-6 max-w-2xl">
                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label className="label">Platform Name</label>
                        <input
                            type="text"
                            className="input w-full"
                            value={settings.platformName}
                            onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="label">Contact Email</label>
                        <input
                            type="email"
                            className="input w-full"
                            value={settings.contactEmail}
                            onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                        />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-slate-900">Maintenance Mode</h4>
                                <p className="text-sm text-slate-500">Temporarily disable the platform for non-admin users.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={settings.maintenanceMode}
                                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-slate-900">Allow Vendor Registration</h4>
                                <p className="text-sm text-slate-500">New vendors can sign up effectively.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={settings.allowVendorRegistration}
                                    onChange={(e) => setSettings({ ...settings, allowVendorRegistration: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button type="submit" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
