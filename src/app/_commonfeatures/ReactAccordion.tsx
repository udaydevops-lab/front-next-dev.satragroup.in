"use client";
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';

// Define types for the item and component props
type AccordionItem = {
    title: string;
    content: React.ReactNode;
};

interface AccordionProps {
    items: AccordionItem[];
}

const ReactAccordion: React.FC<AccordionProps> = ({ items }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(0); // Initially set to 0 (first accordion item)

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index); // Toggle accordion
    };

    return (
        <div className="accordion">
            {items.map((item, index) => (
                <div key={index} className="border-b border-gray-200">
                    <button
                        className="w-full flex justify-between items-center text-left px-4 py-3 bg-gray-300 hover:bg-gray-400 transition duration-300 ease-in-out focus:outline-none"
                        onClick={() => toggleAccordion(index)}
                    >
                        {/* Accordion Header */}
                        <span className="text-[14px] font-medium text-gray-700">{item.title}</span>

                        {/* Chevron Icon based on state */}
                        {activeIndex === index ? (
                            <ChevronUpIcon className="h-5 w-5 text-gray-700" />
                        ) : (
                            <ChevronDownIcon className="h-5 w-5 text-gray-700" />
                        )}
                    </button>

                    {/* Accordion Content */}
                    <div
                        className={`transition-max-height duration-500 ease-in-out overflow-hidden ${activeIndex === index ? 'max-h-screen' : 'max-h-0'
                            }`}
                    >
                        <div className="p-4 bg-white text-gray-600">
                            {item.content}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReactAccordion;
