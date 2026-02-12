import { createContext, useState, useEffect, useContext } from "react";
import { getTags } from "../services/tag.service";

const TagContext = createContext();

export const TagProvider = ({ children }) => {
    const [tags, setTags] = useState([]);

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const data = await getTags();
            setTags(data);
        } catch (err) {
            console.error("Failed to fetch tags context", err);
        }
    };

    // Helper to get fresh tag data by ID
    const getTag = (id) => tags.find(t => t.id === id);

    return (
        <TagContext.Provider value={{ tags, fetchTags, getTag }}>
            {children}
        </TagContext.Provider>
    );
};

export const useTags = () => useContext(TagContext);
