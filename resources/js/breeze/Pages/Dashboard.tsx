import AuthenticatedLayout from '@/breeze/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/breeze/types';

import DashboardMaps from '@/components/DashboardMaps'

export default function Dashboard({ auth }: PageProps) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Maps</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <DashboardMaps laravelUser={auth.user} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
