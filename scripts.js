class NewsViewer extends HTMLElement {
  constructor() {
    super();
    this.apiUrl = 'https://news-foniuhqsba-uc.a.run.app';
  }

  connectedCallback() {
    this.loadArticles();
    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        const category = event.target.getAttribute('data-category');
        this.loadArticles(category);
      });
    });
  }

  async loadArticles(category = 'World News') {
    try {
      const response = await fetch(`${this.apiUrl}/${category}`);
      if (!response.ok) throw new Error('Error al obtener los artículos');
      
      const articles = await response.json();
      this.renderArticles(articles);
    } catch (error) {
      console.error('Error:', error);
      this.innerHTML = `<p>Error al cargar los artículos. Inténtelo nuevamente más tarde.</p>`;
    }
  }

  renderArticles(articles) {
    const template = document.getElementById('article-template');
    this.innerHTML = ''; // Limpiar contenido existente

    articles.forEach(article => {
      const articleContent = document.importNode(template.content, true);
      articleContent.querySelector('.title').innerHTML = article.headline;
      articleContent.querySelector('.author').innerHTML = article.author;
      articleContent.querySelector('.description').innerHTML = article.body;
      
      const readMoreLink = articleContent.querySelector('.read-more');
      readMoreLink.href = `article.html?id=${article.id}`;
      
      this.appendChild(articleContent);
    });
  }
}

customElements.define('news-viewer', NewsViewer);

class RelativeTime extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.render();
    setInterval(() => this.render(), 1000);
  }
  render() {
    const timeValue = this.getAttribute('time')
    const time = timeValue ? new Date(timeValue).getTime() : Date.now();
    const now = Date.now();

    const diff = now - time;
    const seconds = Math.floor(diff / 1000) || 1;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    let aux = '...';
    if (months >= 12) {
      aux = `Hace ${years} año${years > 1 ? 's' : ''}`
    } else if (days > 30 && months >= 1) {
      aux = `Hace ${months} mes${months > 1 ? 'es' : ''}`
    } else if (days >= 1) {
      aux = `Hace ${days} día${days > 1 ? 's' : ''}`
    } else if (hours >= 1) {
      aux = `Hace ${hours} hora${hours > 1 ? 's' : ''}`
    } else if (minutes >= 1) {
      aux = `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
    } else if (seconds >= 1) {
      aux = `Hace ${seconds} segundo${seconds > 1 ? 's' : ''}`
    }

    this.textContent = aux;
  } 
}
customElements.define('relative-time', RelativeTime);

class CustomSearch extends HTMLElement {
  constructor() {
    super();
    this.apiUrl = 'https://news-foniuhqsba-uc.a.run.app';
  }

  connectedCallback() {
    const dialogBtn = this.querySelector('.search-button');
    const closeBtn = this.querySelector('.close-btn');
    const dialog = this.querySelector('dialog');

    dialogBtn.addEventListener('click', () => {
      dialog.showModal();
    });
    closeBtn.addEventListener('click', () => {
      dialog.close();
    });
    const siteSearch = this.querySelector('#site-search');
    siteSearch.addEventListener('input', (event) => this.search(event));

    this.renderResults('')
  }

  search(event) {
    event.preventDefault();
    const siteSearch = this.querySelector('#site-search');
    const term = siteSearch.value
    this.renderResults(term)
  }

  async renderResults(term = '') {
    try {
        const response = await fetch(`${this.apiUrl}/search?term=${term}`);
        if (!response.ok) throw new Error('Error al buscar noticias');

        const articles = await response.json();
        searchResults.innerHTML = '';

        const template = document.getElementById('search-result-template');

        articles.forEach(article => {
            const clonedTemplate = document.importNode(template.content, true);

            clonedTemplate.querySelector('.item-title a').textContent = article.title;
            clonedTemplate.querySelector('.item-description').textContent = article.description;
            clonedTemplate.querySelector('relative-time').setAttribute('time', article.date);

            searchResults.appendChild(clonedTemplate);
        });
    } catch (error) {
        console.error('Error:', error);
        searchResults.innerHTML = `<p>Error al buscar noticias. Inténtelo nuevamente más tarde.</p>`;
    }
  }
}
customElements.define('custom-search', CustomSearch);