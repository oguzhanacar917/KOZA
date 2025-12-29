import React from 'react';

export const SkeletonCard = () => (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 animate-pulse">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-200 rounded-full" />
                <div>
                    <div className="h-4 w-24 bg-neutral-200 rounded mb-2" />
                    <div className="h-3 w-16 bg-neutral-200 rounded" />
                </div>
            </div>
            <div className="h-6 w-16 bg-neutral-200 rounded" />
        </div>
        <div className="h-5 w-3/4 bg-neutral-200 rounded mb-2" />
        <div className="h-4 w-full bg-neutral-200 rounded mb-1" />
        <div className="h-4 w-2/3 bg-neutral-200 rounded mb-4" />
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <div className="flex gap-4">
                <div className="h-4 w-12 bg-neutral-200 rounded" />
                <div className="h-4 w-12 bg-neutral-200 rounded" />
            </div>
            <div className="h-4 w-20 bg-neutral-200 rounded" />
        </div>
    </div>
);

export const SkeletonStory = () => (
    <div className="animate-pulse">
        <div className="h-8 w-3/4 bg-neutral-700 rounded mb-4" />
        <div className="space-y-3">
            <div className="h-4 w-full bg-neutral-700 rounded" />
            <div className="h-4 w-full bg-neutral-700 rounded" />
            <div className="h-4 w-5/6 bg-neutral-700 rounded" />
        </div>
    </div>
);

export const SkeletonProfile = () => (
    <div className="bg-white rounded-2xl border border-neutral-200 p-8 animate-pulse">
        <div className="flex items-center justify-between mb-6">
            <div>
                <div className="h-4 w-16 bg-neutral-200 rounded mb-2" />
                <div className="h-10 w-20 bg-neutral-200 rounded mb-2" />
                <div className="h-4 w-24 bg-neutral-200 rounded" />
            </div>
            <div>
                <div className="h-4 w-16 bg-neutral-200 rounded mb-2" />
                <div className="h-8 w-32 bg-neutral-200 rounded" />
            </div>
        </div>
        <div className="h-3 bg-neutral-200 rounded-full mb-6" />
        <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 rounded-lg">
                <div className="h-8 w-12 bg-neutral-200 rounded mb-2" />
                <div className="h-4 w-24 bg-neutral-200 rounded" />
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
                <div className="h-8 w-12 bg-neutral-200 rounded mb-2" />
                <div className="h-4 w-24 bg-neutral-200 rounded" />
            </div>
        </div>
    </div>
);
