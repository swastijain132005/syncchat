import React from "react";

const MessageMenu = ({
    msg,
    menuOpen,
    setMenuOpen,
    setEditingMessageId,
    setEditedText,
    deleteMessage,
}) => {

    return (
        <>
            <button
                onClick={() => setMenuOpen(msg._id)}
                className="text-xs text-violet-400 mt-1"
            >
                ⋮
            </button>

            {menuOpen === msg._id && (
                <div className="absolute right-0 mt-1 bg-gray-800 rounded-lg shadow-lg z-50">

                    <button
                        onClick={() => {
                            setEditingMessageId(msg._id);
                            setEditedText(msg.text);
                            setMenuOpen(null);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                    >
                        Edit
                    </button>

                    <button
                        onClick={async () => {

                            const ok = window.confirm(
                                "Delete this message?"
                            );

                            if (ok) {
                                await deleteMessage(msg._id);
                            }

                            setMenuOpen(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700"
                    >
                        Delete
                    </button>

                </div>
            )}
        </>
    );
};

export default MessageMenu;