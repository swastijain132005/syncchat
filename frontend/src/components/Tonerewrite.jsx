import React from "react";

const tones = [
    "Professional",
    "Friendly",
    "Polite",
    "Funny",
    "Confident",
    "Short",
];

const ToneRewrite = ({
    open,
    onClose,
    onSelect,
}) => {

    if (!open) return null;

    return (

        <div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            onClick={onClose}
        >

            <div
                onClick={(e)=>e.stopPropagation()}
                className="bg-[#1f1b35] rounded-xl w-80 p-6"
            >

                <h2 className="text-white text-lg font-semibold mb-5">

                    ✨ Rewrite Tone

                </h2>

                <div className="space-y-3">

                    {tones.map((tone)=>(
                        <button

                            key={tone}

                            onClick={()=>onSelect(tone)}

                            className="w-full text-left px-4 py-3 rounded-lg bg-[#2b2647] hover:bg-violet-600 transition text-white"

                        >

                            {tone}

                        </button>
                    ))}

                </div>

            </div>

        </div>

    );

};

export default ToneRewrite;