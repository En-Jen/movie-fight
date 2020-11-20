const autoCompleteConfig = {
    // Render each movie option in dropdown
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src="${imgSrc}"/>
            ${movie.Title} (${movie.Year})
        `;
    },
    // Change input value to the selected movie title
    inputValue(movie) {
        return movie.Title
    },
    // Fetch movies based on search input
    async fetchData(searchTerm) {
        const response = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: 'a1f890d6',
                s: searchTerm
            }
        });
    
        if (response.data.Error) {
            return [];
        }
    
        return response.data.Search;
    }
};

createAutoComplete({
    // Copy everything inside of autoCompleteConfig
    ...autoCompleteConfig,
    // Location in HTML where left autocomplete is located
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        // Hide tutorial when user clicks on a movie option
        document.querySelector('.tutorial').classList.add('is-hidden');
        // Fetch data from API on the selected option and render it to the page
        onMovieSelect(movie, document.querySelector('#left-summary'));
    },
});

createAutoComplete({
    // Copy everything inside of autoCompleteConfig
    ...autoCompleteConfig,
    // Location in HTML where right autocomplete is located
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        // Hide tutorial when user clicks on a movie option
        document.querySelector('.tutorial').classList.add('is-hidden');
        // Fetch data from API on the selected option and render it to the page
        onMovieSelect(movie, document.querySelector('#right-summary'));
    },
});

// Fetch detailed data about a selected movie
const onMovieSelect = async (movie, summaryElement) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'a1f890d6',
            i: movie.imdbID
        }
    });

    summaryElement.innerHTML = movieTemplate(response.data);
};

// HTML for movie details
const movieTemplate = (movieDetail) => {
    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}">
                </p>
            </figure>
            <div class="media-content">
            <div class="content">
                <h1>${movieDetail.Title}</h1>
                <h4>${movieDetail.Genre}</h4>
                <p>${movieDetail.Plot}</p>
            </div>
            </div>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article><article class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};