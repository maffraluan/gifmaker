import React, { useState, useRef, useCallback } from "react";

import { Paginate } from '../_Pagination/Pagination';

import useFetchGifs from '../../utils/useFetchGif';

export function Giphy() {
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [savedGif, setSavedGif] = useState([]);

  const { loading, error, gifs, hasMore } = useFetchGifs(query, pageNumber);

  const observer = useRef();
  const lastGifElement = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    })
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = gifs.slice(indexOfFirstItem, indexOfLastItem);

  const saveGifs = (id) => {
    if (!id) return;
    setSavedGif(id);
  };

  const renderGifs = () => {
    return currentItems.map((gif) => {
      return (
        <div key={gif.id} ref={lastGifElement}>
          <div className="card" style={{ width: '18rem' }}>
            <img className="card-img-top" src={gif.images.fixed_height.url} alt="Gifs" />
            <div className="card-body">
              <h5 className="card-title">{gif.title}</h5>
              <p className="card-text">{gif?.user?.description}</p>
              <p className="card-text">{gif?.user?.display_name}</p>
              <button
                onClick={() => saveGifs(gif.id)}
                className="btn btn-primary ml-2">
                Salvar
              </button>
            </div>
          </div>
        </div>
      )
    }
    )
  };

  const handleSearchChange = e => {
    setQuery(e.target.value);
    setPageNumber(1)
  };


  const pageSelected = pageNumber => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="m-2">
      <form className="form-inline justify-content-center m-2">
        <input
          value={query}
          onChange={handleSearchChange}
          type="text"
          placeholder="Procurar Gif"
          className="form-control"
        />
        <button type="button" className="btn btn-primary ml-2">
          Salvos {savedGif}
        </button>
      </form>
      <Paginate
        pageSelected={pageSelected}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={gifs.length}
      />
      <div className="container d-flex flex-sm-row flex-wrap">{renderGifs()}</div>
    </div>
  );
};
