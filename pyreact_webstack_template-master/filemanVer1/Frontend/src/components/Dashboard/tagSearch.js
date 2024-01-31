import React, { useState, useEffect } from "react";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import api from "../Services/token_refresh";

const filter = createFilterOptions();

export default function TagSearch({ tags, hoistTags }) {
  const [searchKey, setSearchKey] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [topTags, setTopTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTags, setNewTags] = useState([]);

  useEffect(() => {
    const topTagSearch = async () => {
      try {
        const response = await api.get(`/tag/top/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });
        setTopTags(response.data);
      } catch (error) {
        console.error("Error fetching top tags", error);
      }
    };

    topTagSearch();
  }, []);

  useEffect(() => {
    if (searchKey) {
      const tagSearch = async () => {
        try {
          const response = await api.get(`/tag/top/`, {
            params: { searchKey },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          });
          setSearchResult(response.data);
        } catch (error) {
          console.error("Error fetching tags", error);
        }
      };

      tagSearch();
    }
  }, [searchKey]);

  const handleTagChange = (event, value) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      return;
    }

    setSelectedTags(value);
    
  };

  useEffect(()=>{
    hoistTags(selectedTags.map((tag)=> tag.id?({id:tag.id,name:tag.name}): ({name:tag.name})));
  }
  ,[selectedTags]);
  const handleInputChange = (event, value, reason) => {
    if (reason === "input") {
      // If the user is inputting a new tag, add it to the newTags state
      const inputValue = value.trim().toLowerCase();

      // Check if the tag already exists in selectedTags or newTags
      const isExisting = selectedTags.some((tag) => tag.name === inputValue);
      const isNew = newTags.some((newTag) => newTag.name === inputValue);

      // Only add the tag to newTags if it's not in selectedTags or newTags
      if (!isNew && !isExisting) {
        setNewTags((prevTags) => [...prevTags, { name: inputValue }]);
      }
    }
  };

  return (
    <Autocomplete
      multiple
      limitTags={2}
      size="small"
      id="multiple-limit-tags"
      options={searchKey ? searchResult.filter((tag) => !newTags.some((newTag) => newTag.name === tag.name) && !selectedTags.some((selectedTag) => selectedTag.name === tag.name)) : topTags}
      getOptionLabel={(option) => (option.name ? option.name : option)}
      value={selectedTags}
      onChange={handleTagChange}
      onInputChange={handleInputChange}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;

        if (inputValue !== "") {
          // Suggest the creation of a new value if not in selectedTags or newTags
          const isExisting = options.some((option) => inputValue === option.name);
          if (!isExisting && !selectedTags.some((tag) => tag.name === inputValue) && !newTags.some((newTag) => newTag.name === inputValue)) {
            filtered.push({
              inputValue,
              name: inputValue,
            });
          }
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      limit={2}
      handleHomeEndKeys
      freeSolo
      sx={{ width: "300px" }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Add Tags"
          placeholder=" "
          onChange={(e) => setSearchKey(e.target.value)}
        />
      )}
    />
  );
}
