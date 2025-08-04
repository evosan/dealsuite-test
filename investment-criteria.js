// Investment Criteria JavaScript
// Dynamic modal and feed functionality

// Global state - Array to store multiple criteria
let allCriteria = [];
let currentCriteriaIndex = 0;

// Counter for criteria numbering
let criteriaCounter = 1;

// Maximum criteria limit
const MAX_CRITERIA = 10;

// Flag to track if we're editing vs creating new
let isEditingExisting = false;

// Helper function to get current criteria
function getCurrentCriteria() {
    return allCriteria[currentCriteriaIndex] || null;
}

// Modal functions
function openNewCriteriaModal() {
    // Marcar que estamos añadiendo un criterio nuevo
    isEditingExisting = false;
    
    // Limpiar el modal para nuevo criterio
    clearModalForm();
    
    // Ocultar botón de remove criteria (es nuevo)
    document.getElementById('remove-criteria-btn').style.display = 'none';
    
    // Ocultar mensaje de confirmación
    document.getElementById('remove-confirmation').style.display = 'none';
    
    // Añadir clase para distribuir botones cuando no hay remove button
    document.querySelector('.modal-footer').classList.add('no-remove-btn');
    
    document.getElementById('investment-modal').style.display = 'flex';
    
    // Hacer focus en el primer input
    setTimeout(() => {
        const titleInput = document.getElementById('criteria-title');
        if (titleInput) {
            titleInput.focus();
        }
    }, 100);
}

function handleSaveCriteria() {
    // Guardar si es nuevo criterio o edición
    const isNewCriteria = !isEditingExisting;
    const criteriaTitle = document.getElementById('criteria-title').value || '';
    
    // Llamar a la función normal de guardar
    saveInvestmentCriteria();
    
    // Mostrar toast apropiado
    if (isNewCriteria) {
        setTimeout(() => {
            showUndoToast();
        }, 100);
    } else {
        // Es una edición
        setTimeout(() => {
            showEditToast(criteriaTitle);
        }, 100);
    }
}

function openInvestmentModal() {
    // Marcar que estamos editando un criterio existente
    isEditingExisting = true;
    
    // Guardar el estado anterior para poder hacer undo
    if (allCriteria[currentCriteriaIndex]) {
        previousCriteriaState = JSON.parse(JSON.stringify(allCriteria[currentCriteriaIndex]));
    }
    
    // Mostrar botón de remove criteria solo si hay 2 o más criterios
    const removeBtn = document.getElementById('remove-criteria-btn');
    const modalFooter = document.querySelector('.modal-footer');
    
    if (allCriteria.length >= 2) {
        removeBtn.style.display = 'flex';
        modalFooter.classList.remove('no-remove-btn');
    } else {
        removeBtn.style.display = 'none';
        modalFooter.classList.add('no-remove-btn');
    }
    
    // Ocultar mensaje de confirmación
    document.getElementById('remove-confirmation').style.display = 'none';
    
    // Cargar los datos del criterio actual en el modal
    loadCriteriaIntoModal();
    
    document.getElementById('investment-modal').style.display = 'flex';
    
    // Usar setTimeout para asegurar que el modal esté renderizado
    setTimeout(() => {
        updateModalNavigation();
    }, 50);
    
    // Hacer focus en el primer input para consistencia
    setTimeout(() => {
        const titleInput = document.getElementById('criteria-title');
        if (titleInput) {
            titleInput.focus();
        }
    }, 100);
}

// Función para cargar datos de un criterio en el modal
function loadCriteriaIntoModal() {
    const currentCriteria = getCurrentCriteria();
    if (!currentCriteria) return;
    
    // Actualizar título del modal
    const modalTitle = document.getElementById('modal-title');
    if (modalTitle) {
        modalTitle.textContent = currentCriteria.title || 'Investment criteria';
    }
    
    // Pre-llenar campos de texto
    document.getElementById('criteria-title').value = currentCriteria.title || '';
    document.getElementById('criteria-description').value = currentCriteria.description || '';
    
    // Pre-llenar todos los demás campos
    // Checkboxes
    document.querySelectorAll('input[name="growth"]').forEach(cb => {
        cb.checked = currentCriteria.growth.includes(cb.value);
    });
    document.querySelectorAll('input[name="profitability"]').forEach(cb => {
        cb.checked = currentCriteria.profitability.includes(cb.value);
    });
    document.querySelectorAll('input[name="equity"]').forEach(cb => {
        cb.checked = currentCriteria.equity.includes(cb.value);
    });
    document.querySelectorAll('input[name="countries"]').forEach(cb => {
        cb.checked = currentCriteria.countries.includes(cb.value);
    });
    document.querySelectorAll('input[name="sectors"]').forEach(cb => {
        cb.checked = currentCriteria.sectors.includes(cb.value);
    });
    
    // Radio buttons
    // Limpiar primero
    document.querySelectorAll('input[name="strategy"]').forEach(rb => rb.checked = false);
    if (currentCriteria.strategy) {
        const strategyRadio = document.querySelector(`input[name="strategy"][value="${currentCriteria.strategy}"]`);
        if (strategyRadio) strategyRadio.checked = true;
    }
    
    // Range inputs
    document.getElementById('revenue-min').value = currentCriteria.revenueMin?.replace(/€|million/g, '').trim() || '';
    document.getElementById('revenue-max').value = currentCriteria.revenueMax?.replace(/€|million/g, '').trim() || '';
    document.getElementById('ebitda-min').value = currentCriteria.ebitdaMin?.replace(/€|million/g, '').trim() || '';
    document.getElementById('ebitda-max').value = currentCriteria.ebitdaMax?.replace(/€|million/g, '').trim() || '';
}

function openNewCriteriaModal() {
    // Verificar límite de criterios
    if (allCriteria.length >= MAX_CRITERIA) {
        alert('Maximum of 10 criteria reached. Cannot add more criteria.');
        return;
    }
    
    // Marcar que estamos creando un criterio nuevo
    isEditingExisting = false;
    
    // Limpiar todos los campos del modal para crear un nuevo criterio
    clearModalFields();
    
    // Pre-llenar título con el siguiente número disponible
    document.getElementById('criteria-title').value = `Investment Criteria ${criteriaCounter}`;
    
    // Actualizar título del modal
    const modalTitle = document.getElementById('modal-title');
    if (modalTitle) {
        modalTitle.textContent = 'Investment criteria';
    }
    
    // Abrir el modal
    document.getElementById('investment-modal').style.display = 'flex';
    
    // Actualizar navegación del modal (ocultar flechas para nuevo criterio)
    updateModalNavigation();
    
    // Hacer focus en el primer input (título) y seleccionar todo el texto
    setTimeout(() => {
        const titleInput = document.getElementById('criteria-title');
        if (titleInput) {
            titleInput.focus();
            titleInput.select();
        }
    }, 100);
}

// Función para limpiar todos los campos del modal
function clearModalFields() {
    // Limpiar descripción
    document.getElementById('criteria-description').value = '';
    
    // Limpiar todos los checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    // Limpiar todos los radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(rb => rb.checked = false);
    
    // Limpiar campos de rango
    document.getElementById('revenue-min').value = '';
    document.getElementById('revenue-max').value = '';
    document.getElementById('ebitda-min').value = '';
    document.getElementById('ebitda-max').value = '';
}

function closeInvestmentModal() {
    document.getElementById('investment-modal').style.display = 'none';
    
    // DIRTY: Scroll directo al panel
    setTimeout(() => {
        // Buscar el elemento por clase y hacer scroll inmediato
        const element = document.querySelector('.investment-criteria-dynamic') || 
                       document.querySelector('[class*="investment-criteria"]') ||
                       document.querySelector('[class*="criteria-dynamic"]');
        
        if (element) {
            // Scroll más suave, no tan arriba
            const rect = element.getBoundingClientRect();
            const offset = window.pageYOffset + rect.top - 200; // 200px desde arriba
            window.scrollTo(0, offset);
        } else {
            // Fallback: scroll a una posición fija
            window.scrollTo(0, 600);
        }
    }, 50);
    
    // Resetear flag de edición
    isEditingExisting = false;
}

function toggleWorldwide(checkbox) {
    const subcategories = document.querySelectorAll('.countries-subcategories input[type="checkbox"]');
    subcategories.forEach(cb => {
        cb.checked = checkbox.checked;
        cb.disabled = checkbox.checked;
    });
}

function filterSectors(query) {
    const sectors = document.querySelectorAll('.sector-item');
    sectors.forEach(sector => {
        const text = sector.textContent.toLowerCase();
        if (text.includes(query.toLowerCase())) {
            sector.style.display = 'block';
        } else {
            sector.style.display = 'none';
        }
    });
}

function saveInvestmentCriteria() {
    // Recopilar datos del formulario
    const formData = {
        title: document.getElementById('criteria-title').value || '',
        description: document.getElementById('criteria-description').value || '',
        growth: Array.from(document.querySelectorAll('input[name="growth"]:checked')).map(cb => cb.value),
        profitability: Array.from(document.querySelectorAll('input[name="profitability"]:checked')).map(cb => cb.value),
        equity: Array.from(document.querySelectorAll('input[name="equity"]:checked')).map(cb => cb.value),
        strategy: document.querySelector('input[name="strategy"]:checked')?.value || '',
        revenueMin: document.getElementById('revenue-min').value ? `€ ${document.getElementById('revenue-min').value} million` : '',
        revenueMax: document.getElementById('revenue-max').value ? `€ ${document.getElementById('revenue-max').value} million` : '',
        ebitdaMin: document.getElementById('ebitda-min').value ? `€ ${document.getElementById('ebitda-min').value} million` : '',
        ebitdaMax: document.getElementById('ebitda-max').value ? `€ ${document.getElementById('ebitda-max').value} million` : '',
        countries: Array.from(document.querySelectorAll('input[name="countries"]:checked')).map(cb => cb.value),
        sectors: Array.from(document.querySelectorAll('input[name="sectors"]:checked')).map(cb => cb.value)
    };


    
    // Usar el flag para determinar si es nuevo o edición
    if (!isEditingExisting) {
        // Es un criterio nuevo - verificar límite antes de agregar
        if (allCriteria.length >= MAX_CRITERIA) {
            alert('Maximum of 10 criteria reached. Cannot save more criteria.');
            return;
        }
        
        // Agregar nuevo criterio al array
        allCriteria.push(formData);
        currentCriteriaIndex = allCriteria.length - 1; // Mostrar el nuevo criterio
        
        // Incrementar contador
        const titleNumber = parseInt(formData.title.split(' ')[2]);
        if (titleNumber >= criteriaCounter) {
            criteriaCounter = titleNumber + 1;
        }
    } else {
        // Es una edición - actualizar criterio existente
        if (allCriteria[currentCriteriaIndex]) {
            allCriteria[currentCriteriaIndex] = formData;
        }
    }
    

    
    // Actualizar la visualización
    updateInvestmentCriteriaDisplay();
    
    // Cerrar modal
    closeInvestmentModal();
}

let maxCriteriaHeight = 0;

function updateInvestmentCriteriaDisplay() {
    const investmentDynamic = document.getElementById('investment-criteria-dynamic');
    
    // Verificar que el elemento existe
    if (!investmentDynamic) {
        console.error('Element with ID "investment-criteria-dynamic" not found');
        return;
    }
    
    // Verificar si hay criterios para mostrar
    const hasData = allCriteria.length > 0;
    if (hasData) {
        
        // Crear el HTML completo incluyendo el header
        const canAddMore = allCriteria.length < MAX_CRITERIA;
        let html = `
            <div class="section-header">
                <h2>Investment Criteria</h2>
                <div class="header-actions">
                    <button class="add-criteria-btn" onclick="openNewCriteriaModal()" ${!canAddMore ? 'disabled' : ''}>
                        <span class="plus-icon">+</span>
                        <span>Add criteria</span>
                    </button>
                    <button class="edit-icon-btn" onclick="openInvestmentModal()">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 20.0001H20M4 20.0001V16.0001L14.8686 5.13146L14.8704 5.12976C15.2652 4.73488 15.463 4.53709 15.691 4.46301C15.8919 4.39775 16.1082 4.39775 16.3091 4.46301C16.5369 4.53704 16.7345 4.7346 17.1288 5.12892L18.8686 6.86872C19.2646 7.26474 19.4627 7.46284 19.5369 7.69117C19.6022 7.89201 19.6021 8.10835 19.5369 8.3092C19.4628 8.53736 19.265 8.73516 18.8695 9.13061L18.8686 9.13146L8 20.0001L4 20.0001Z" stroke="#6B9286" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>`;
        
        // Mostrar mensaje de límite alcanzado si es necesario
        if (!canAddMore) {
            html += `<div class="max-criteria-message">Maximum of 10 criteria reached.</div>`;
        }
            
        // Container principal con arrows y contenido
        const currentCriteria = getCurrentCriteria();
        if (currentCriteria && currentCriteria.title) {
                    const showLeftArrow = allCriteria.length > 1;
        const showRightArrow = allCriteria.length > 1;
            
            // Container principal con arrows a los lados
            html += `<div class="criteria-main-container">
                ${showLeftArrow ? `<button class="criteria-nav-arrow criteria-nav-left" onclick="navigateCriteria(-1)">‹</button>` : '<div class="criteria-nav-placeholder"></div>'}
                
                <div class="criteria-content-wrapper">
                    <!-- Card de título/descripción rediseñada -->
                    <div class="criteria-title-card">
                        <div class="criteria-card-icon">
                            <div class="criteria-icon-circle">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 7H21L19 19H5L3 7Z" stroke="#174D3D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M3 7L2 3H1" stroke="#174D3D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <circle cx="9" cy="21" r="1" stroke="#174D3D" stroke-width="2"/>
                                    <circle cx="20" cy="21" r="1" stroke="#174D3D" stroke-width="2"/>
                                </svg>
                            </div>
                        </div>
                        <div class="criteria-card-content">
                            <h3>${currentCriteria.title}</h3>`;
            if (currentCriteria.description) {
                html += `<p>${currentCriteria.description}</p>`;
            }
            html += `    </div>
                    </div>
                    
                    <!-- Grid de cards de criterios -->
                    <div class="criteria-display-grid">`;
        
        // Check if both cards exist for full-width logic
        const hasGrowth = currentCriteria.growth.length > 0;
        const hasOtherInfo = currentCriteria.profitability.length > 0 || currentCriteria.equity.length > 0;
        
        // Growth Percentage (Top Left)
        if (hasGrowth) {
            const fullWidth = !hasOtherInfo ? ' full-width' : '';
            html += `<div class="criteria-card${fullWidth}"><h4>Growth Percentage</h4><ul>`;
            currentCriteria.growth.forEach(item => {
                const labels = {
                    '5-15': '<span class="semibold">5%-15%</span> growth per year',
                    '15-30': '<span class="semibold">15%-30%</span> growth per year', 
                    '30+': '<span class="semibold">30% growth</span> per year or more',
                    'decline': 'In decline',
                    'mature': 'Hardly growing or declining (mature phase)'
                };
                html += `<li>${labels[item] || item}</li>`;
            });
            html += '</ul></div>';
        } else {
            html += '<div class="criteria-card empty"></div>';
        }

        // Other Information (Bottom Left)
        if (hasOtherInfo) {
            const fullWidth = !hasGrowth ? ' full-width' : '';
            html += `<div class="criteria-card other-info-card${fullWidth}"><h4>Other information</h4>`;
            html += '<div class="other-info-content">';
            
            // Profitability
            if (currentCriteria.profitability.length > 0) {
                const profitabilityText = currentCriteria.profitability.join(', ');
                html += `<div class="info-item">
                    <span class="info-label">Profitability:</span>
                    <div class="info-value"><span class="semibold">${profitabilityText}</span></div>
                </div>`;
            }
            
            // Equity stake
            if (currentCriteria.equity.length > 0) {
                html += `<div class="info-item">
                    <span class="info-label">Equity stake:</span>
                    <ul class="equity-list">`;
                currentCriteria.equity.forEach(eq => {
                    const eqLabels = {
                        'minority': 'Minority',
                        'majority': 'Majority',
                        '100': '100% sale'
                    };
                    html += `<li><span class="semibold">${eqLabels[eq] || eq}</span></li>`;
                });
                html += '</ul></div>';
            }
            html += '</div></div>';

        // Company Size (Always full-width)
        if (currentCriteria.revenueMin || currentCriteria.revenueMax || 
                currentCriteria.ebitdaMin || currentCriteria.ebitdaMax) {
                html += '<div class="criteria-card company-size-card full-width"><h4>Company size</h4>';
                html += '<div class="company-size-content">';
                
                // Revenue range
                if (currentCriteria.revenueMin || currentCriteria.revenueMax) {
                    const revenueMin = currentCriteria.revenueMin || '';
                    const revenueMax = currentCriteria.revenueMax || '';
                    html += `<div class="size-item">
                        <span class="size-label">Revenue range</span>
                        <div class="size-value">${revenueMin} - ${revenueMax}</div>
                    </div>`;
                }
                
                // EBITDA range
                if (currentCriteria.ebitdaMin || currentCriteria.ebitdaMax) {
                    const ebitdaMin = currentCriteria.ebitdaMin || '';
                    const ebitdaMax = currentCriteria.ebitdaMax || '';
                    html += `<div class="size-item">
                        <span class="size-label">EBITDA range</span>
                        <div class="size-value">${ebitdaMin} - ${ebitdaMax}</div>
                    </div>`;
                }
                html += '</div></div>';
            } else {
                html += '<div class="criteria-card empty"></div>';
            }
        } else {
            html += '<div class="criteria-card empty"></div>';
        }

        // Countries (Always full-width)
        if (currentCriteria.countries.length > 0) {
            html += '<div class="criteria-card full-width"><h4>Countries</h4><ul>';
            currentCriteria.countries.forEach(country => {
                const labels = {
                    'worldwide': 'Worldwide',
                    'europe': 'Europe',
                    'north-america': 'North America',
                    'asia': 'Asia',
                    'south-america': 'South America',
                    'africa': 'Africa',
                    'oceania': 'Oceania',
                    'ireland': 'Ireland',
                    'uk': 'United Kingdom'
                };
                html += `<li>${labels[country] || country}</li>`;
            });
            html += '</ul></div>';
        } else {
            html += '<div class="criteria-card empty"></div>';
        }
        
        // Sectors (Always full-width)
        if (currentCriteria.sectors.length > 0) {
            html += '<div class="criteria-card full-width"><h4>Sectors</h4><div class="sectors-tags-display">';
            currentCriteria.sectors.forEach(sector => {
                const labels = {
                    'agri-food': 'Agri & Food',
                    'automobile': 'Automobile & Parts', 
                    'banks': 'Banks',
                    'basic-resources': 'Basic Resources',
                    'business-services': 'Business Services',
                    'chemicals': 'Chemicals',
                    'consumer-products': 'Consumer products & Services',
                    'energy': 'Energy',
                    'financial-services': 'Financial Services',
                    'health-care': 'Health and Care',
                    'industry': 'Industry',
                    'insurance': 'Insurance',
                    'media': 'Media',
                    'personal-care': 'Personal Care & Drug Stores',
                    'real-estate': 'Real Estate',
                    'retail': 'Retail',
                    'technology': 'Technology',
                    'telecommunications': 'Telecommunications',
                    'transport-logistics': 'Transport & Logistics',
                    'travel-leisure': 'Travel and Leisure',
                    'utilities': 'Utilities'
                };
                html += `<span class="sector-tag">${labels[sector] || sector}</span>`;
            });
            html += '</div></div>';
        }

        // Contar cuántas cards tienen contenido en el criterio actual
        let filledCards = 0;
        if (hasGrowth) filledCards++;
        if (hasOtherInfo) filledCards++;
        if (currentCriteria.revenueMin || currentCriteria.revenueMax || currentCriteria.ebitdaMin || currentCriteria.ebitdaMax) filledCards++;
        if (currentCriteria.countries.length > 0) filledCards++;
        if (currentCriteria.sectors.length > 0) filledCards++;
        
        // Añadir banner según el número de cards con contenido
        if (filledCards <= 2) {
            // Solo mostrar banner en los primeros 2 criterios
            if (currentCriteriaIndex < 2) {
                // Banner completo para 0-2 cards
                html += `
                    <div class="criteria-banner">
                        <div class="banner-illustration">
                            <img src="http://localhost:3845/assets/177c2b0ea0ab3bb3fc3dcebac1c57dfea38e2f9d.png" alt="Add criteria illustration" width="168" height="96" />
                        </div>
                        <div class="banner-content">
                            <p class="banner-text">Most buyers who define at least 3 criteria receive significantly better matches.</p>
                            <button class="banner-btn" onclick="openInvestmentModal()">Add more criteria</button>
                        </div>
                    </div>`;
            } else {
                // Hint para criterios posteriores con 0-2 cards
                html += `
                    <div class="criteria-hint">
                        <p class="hint-text">Add more details to improve match quality</p>
                    </div>`;
            }
        } else if (filledCards >= 3 && filledCards <= 4) {
            // Solo mostrar banner en los primeros 2 criterios
            if (currentCriteriaIndex < 2) {
                // Banner completo para 3-4 cards
                html += `
                    <div class="criteria-banner">
                        <div class="banner-illustration">
                            <img src="http://localhost:3845/assets/795bf570314b3bf842d3c6e35131a3d9788099eb.png" alt="Analytics illustration" width="168" height="96" />
                        </div>
                        <div class="banner-content">
                            <p class="banner-text">Top buyers define all criteria and receive personalized matches and better opportunities</p>
                            <button class="banner-btn" onclick="openInvestmentModal()">Add more criteria</button>
                        </div>
                    </div>`;
            } else {
                // Hint para criterios posteriores con 3-4 cards
                html += `
                    <div class="criteria-hint">
                        <p class="hint-text">Add more details to improve match quality</p>
                    </div>`;
            }
        } else if (filledCards >= 5) {
            // 5+ cards: Siempre mostrar hint (sin banner)
            html += `
                <div class="criteria-hint">
                    <p class="hint-text">Add more details to improve match quality</p>
                </div>`;
        }

        // Cerrar el grid
        html += '</div>';
        
                    
                    // Cerrar el content wrapper
                    html += `</div>
                
                ${showRightArrow ? `<button class="criteria-nav-arrow criteria-nav-right" onclick="navigateCriteria(1)">›</button>` : '<div class="criteria-nav-placeholder"></div>'}
            </div>`;
            
            // Paginación debajo del banner
            if (allCriteria.length > 1) {
                html += `<div class="criteria-pagination">`;
                for (let i = 0; i < allCriteria.length; i++) {
                    html += `<span class="pagination-dot ${i === currentCriteriaIndex ? 'active' : ''}" onclick="goToCriteria(${i})"></span>`;
                }
                html += `</div>`;
            }
        }

        investmentDynamic.innerHTML = html;
        // Ajustar altura dinámica basada en la card más alta
        setTimeout(() => {
            const wrapper = investmentDynamic.querySelector('.criteria-content-wrapper');
            if (wrapper) {
                const h = wrapper.offsetHeight;
                if (h > maxCriteriaHeight) {
                    maxCriteriaHeight = h;
                }
                wrapper.style.minHeight = maxCriteriaHeight + 'px';
            }
        }, 0);
    } else {
        // Si no hay criterios, mostrar placeholder con header
        const canAddMore = allCriteria.length < MAX_CRITERIA;
        investmentDynamic.innerHTML = `
            <div class="section-header">
                <h2>Investment Criteria</h2>
                <div class="header-actions">
                    <button class="add-criteria-btn" onclick="openNewCriteriaModal()" ${!canAddMore ? 'disabled' : ''}>
                        <span class="plus-icon">+</span>
                        <span>Add criteria</span>
                    </button>
                    <button class="edit-icon-btn" onclick="openInvestmentModal()">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 20.0001H20M4 20.0001V16.0001L14.8686 5.13146L14.8704 5.12976C15.2652 4.73488 15.463 4.53709 15.691 4.46301C15.8919 4.39775 16.1082 4.39775 16.3091 4.46301C16.5369 4.53704 16.7345 4.7346 17.1288 5.12892L18.8686 6.86872C19.2646 7.26474 19.4627 7.46284 19.5369 7.69117C19.6022 7.89201 19.6021 8.10835 19.5369 8.3092C19.4628 8.53736 19.265 8.73516 18.8695 9.13061L18.8686 9.13146L8 20.0001L4 20.0001Z" stroke="#6B9286" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
            ${!canAddMore ? `<div class="max-criteria-message">Maximum of 10 criteria reached.</div>` : ''}
            <div class="criteria-placeholder">
                <p class="placeholder-text">Esta sección se cargará dinámicamente mediante un modal...</p>
                ${canAddMore ? `<button class="configure-criteria-btn" onclick="openNewCriteriaModal()">Configurar Criterios</button>` : ''}
            </div>
        `;
    }
}

// Función para cargar datos iniciales desde el formulario pre-seleccionado
function loadInitialData() {
    // Solo crear un criterio inicial si no hay ninguno y hay datos en el formulario
    if (allCriteria.length === 0) {
        const titleElement = document.getElementById('criteria-title');
        if (titleElement) {
            titleElement.value = `Investment Criteria ${criteriaCounter}`;
            // Marcar como nuevo criterio para la carga inicial
            isEditingExisting = false;
            saveInvestmentCriteria();
        }
    }
}

// Function to debug element existence
function debugElements() {
    console.log('--- DEBUG ELEMENTS ---');
    const investmentDynamic = document.getElementById('investment-criteria-dynamic');
    console.log('investment-criteria-dynamic element:', investmentDynamic);
    if (investmentDynamic) {
        console.log('investment-criteria-dynamic found, innerHTML length:', investmentDynamic.innerHTML.length);
    }
    console.log('--- END DEBUG ---');
}

// Function to test title/description display
function testTitleDescription() {
    const testCriteria = {
        title: 'Test Title',
        description: 'Test Description',
        growth: [],
        profitability: [],
        equity: [],
        strategy: '',
        revenueMin: '',
        revenueMax: '',
        ebitdaMin: '',
        ebitdaMax: '',
        countries: [],
        sectors: []
    };
    allCriteria.push(testCriteria);
    currentCriteriaIndex = allCriteria.length - 1;
    updateInvestmentCriteriaDisplay();
}

// Expose function globally for manual testing
window.testTitleDescription = testTitleDescription;

// Navigation functions
function navigateCriteria(direction) {
    const newIndex = currentCriteriaIndex + direction;
    if (newIndex >= allCriteria.length) {
        currentCriteriaIndex = 0; // De 5 va a 1
    } else if (newIndex < 0) {
        currentCriteriaIndex = allCriteria.length - 1; // De 1 va a 5
    } else {
        currentCriteriaIndex = newIndex;
    }
    updateInvestmentCriteriaDisplay();
}

function goToCriteria(index) {
    if (index >= 0 && index < allCriteria.length) {
        currentCriteriaIndex = index;
        updateInvestmentCriteriaDisplay();
    }
}

// Debug function to check current state
function debugCriteriaState() {
    console.log('=== CRITERIA STATE DEBUG ===');
    console.log('Total criteria:', allCriteria.length);
    console.log('Max criteria:', MAX_CRITERIA);
    console.log('Current index:', currentCriteriaIndex);
    console.log('Is editing existing:', isEditingExisting);
    console.log('Criteria counter:', criteriaCounter);
    console.log('All criteria titles:', allCriteria.map(c => c.title));
    console.log('=== END DEBUG ===');
}

// Function to test modal navigation display
function testModalNavigation() {
    console.log('=== TESTING MODAL NAVIGATION ===');
    const leftArrow = document.getElementById('modal-nav-left');
    const rightArrow = document.getElementById('modal-nav-right');
    
    if (leftArrow && rightArrow) {
        console.log('Forcing arrows to show...');
        leftArrow.style.display = 'flex';
        rightArrow.style.display = 'flex';
        leftArrow.style.visibility = 'visible';
        rightArrow.style.visibility = 'visible';
        leftArrow.style.opacity = '1';
        rightArrow.style.opacity = '1';
        
        console.log('Left arrow style:', leftArrow.style.display);
        console.log('Right arrow style:', rightArrow.style.display);
        console.log('Left arrow computed style:', window.getComputedStyle(leftArrow).display);
        console.log('Right arrow computed style:', window.getComputedStyle(rightArrow).display);
        console.log('Arrows should now be visible with background and border');
    } else {
        console.log('ERROR: Arrows not found');
        console.log('Left arrow:', leftArrow);
        console.log('Right arrow:', rightArrow);
    }
    console.log('=== END TEST ===');
}

// Function to create test criteria for navigation testing
function createTestCriteria() {
    console.log('Creating test criteria...');
    
    // Clear existing criteria
    allCriteria = [];
    
    // Create 3 test criteria
    for (let i = 1; i <= 3; i++) {
        const testCriteria = {
            title: `Investment Criteria ${i}`,
            description: `Test description for criteria ${i}`,
            growth: ['5-15'],
            profitability: ['profitable'],
            equity: ['majority'],
            strategy: 'proactive',
            revenueMin: '€ 1 million',
            revenueMax: '€ 10 million',
            ebitdaMin: '€ 0 million',
            ebitdaMax: '€ 2 million',
            countries: ['europe'],
            sectors: ['technology']
        };
        allCriteria.push(testCriteria);
    }
    
    // Set current index to first criteria (index 0, so only right arrow should show)
    currentCriteriaIndex = 0;
    criteriaCounter = 4;
    
    console.log('Test criteria created:', allCriteria.length);
    console.log('Current index set to:', currentCriteriaIndex);
    
    // Update the display
    updateInvestmentCriteriaDisplay();
    
    console.log('Now opening modal and testing navigation...');
    
    // Auto-open modal for testing
    setTimeout(() => {
        isEditingExisting = true;
        document.getElementById('investment-modal').style.display = 'flex';
        loadCriteriaIntoModal();
        
        setTimeout(() => {
            console.log('Modal opened, updating navigation...');
            updateModalNavigation();
        }, 100);
    }, 500);
}

// Modal navigation functions
function navigateModalCriteria(direction) {
    // Solo permitir navegación si estamos editando y hay criterios
    if (!isEditingExisting || allCriteria.length <= 1) return;
    
    const newIndex = currentCriteriaIndex + direction;
    if (newIndex >= 0 && newIndex < allCriteria.length) {
        currentCriteriaIndex = newIndex;
        loadCriteriaIntoModal();
        updateModalNavigation();
        // También actualizar la visualización principal en background
        updateInvestmentCriteriaDisplay();
    }
}

function updateModalNavigation() {
    const leftArrow = document.getElementById('modal-nav-left');
    const rightArrow = document.getElementById('modal-nav-right');
    
    if (!leftArrow || !rightArrow) {
        console.log('ERROR: Navigation arrows not found in DOM');
        return;
    }
    
    // Solo mostrar flechas si estamos editando un criterio existente Y hay más de 1 criterio
    if (isEditingExisting && allCriteria.length > 1) {
        // Flecha izquierda: mostrar SOLO si hay criterios anteriores
        const canGoLeft = currentCriteriaIndex > 0;
        leftArrow.style.display = canGoLeft ? 'flex' : 'none';
        
        // Flecha derecha: mostrar SOLO si hay criterios posteriores  
        const canGoRight = currentCriteriaIndex < allCriteria.length - 1;
        rightArrow.style.display = canGoRight ? 'flex' : 'none';
        

    } else {
        // Ocultar ambas flechas si es nuevo criterio o solo hay 1 criterio
        leftArrow.style.display = 'none';
        rightArrow.style.display = 'none';
    }
}

// Function to test navigation behavior step by step
function testAllNavigationCases() {
    console.log('🧪 Testing all navigation cases...\n');
    
    createTestCriteria();
    
    setTimeout(() => {
        console.log('📍 Test Case 1: Criterio 1 (should show only RIGHT arrow →)');
        currentCriteriaIndex = 0;
        isEditingExisting = true;
        document.getElementById('investment-modal').style.display = 'flex';
        loadCriteriaIntoModal();
        updateModalNavigation();
        
        setTimeout(() => {
            console.log('📍 Test Case 2: Criterio 2 (should show BOTH arrows ← →)');
            currentCriteriaIndex = 1;
            loadCriteriaIntoModal();
            updateModalNavigation();
            
            setTimeout(() => {
                console.log('📍 Test Case 3: Criterio 3 (should show only LEFT arrow ←)');
                currentCriteriaIndex = 2;
                loadCriteriaIntoModal();
                updateModalNavigation();
                console.log('\n✅ Test completed! Check the modal navigation arrows.');
            }, 1000);
        }, 1000);
    }, 500);
}

// Toast notification functions
let toastTimeout;
let previousCriteriaState = null;

function showUndoToast() {
    // Limpiar toast anterior si existe
    hideToast();
    
    // Crear toast
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.id = 'undo-toast';
    
    toast.innerHTML = `
        <div class="toast-icon"></div>
        <div class="toast-content">
            <div class="toast-title">Added a new criteria in "My organization"</div>
            <div class="toast-message">Add criterias to find the best propositions</div>
            <div class="toast-actions">
                <button class="toast-undo" onclick="undoLastCriteria()">Undo</button>
            </div>
        </div>
        <button class="toast-close" onclick="hideToast()">×</button>
    `;
    
    document.body.appendChild(toast);
    
    // Mostrar con animación
    setTimeout(() => {
        toast.classList.add('show');
        // Hacer blink del panel investment criteria dynamic
        blinkInvestmentPanel();
    }, 10);
    
    // Auto-hide después de 5 segundos
    toastTimeout = setTimeout(() => {
        hideToast();
    }, 5000);
}

function showEditToast(criteriaTitle) {
    // Limpiar toast anterior si existe
    hideToast();
    
    // Crear toast
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.id = 'edit-toast';
    
    // Usar el nombre del criterio si está disponible
    const displayTitle = criteriaTitle ? `"${criteriaTitle}"` : 'criteria';
    
    toast.innerHTML = `
        <div class="toast-icon"></div>
        <div class="toast-content">
            <div class="toast-title">The ${displayTitle} was edited</div>
            <div class="toast-actions">
                <button class="toast-undo" onclick="undoEdit()">Undo</button>
            </div>
        </div>
        <button class="toast-close" onclick="hideToast()">×</button>
    `;
    
    document.body.appendChild(toast);
    
    // Mostrar con animación
    setTimeout(() => {
        toast.classList.add('show');
        // Hacer blink del panel investment criteria dynamic
        blinkInvestmentPanel();
    }, 10);
    
    // Auto-hide después de 5 segundos
    toastTimeout = setTimeout(() => {
        hideToast();
    }, 5000);
}

function showRemoveToast(criteriaTitle, removedCriteria, removedIndex) {
    // Limpiar toast anterior si existe
    hideToast();
    
    // Crear toast
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.id = 'remove-toast';
    
    // Usar el nombre del criterio
    const displayTitle = criteriaTitle ? `"${criteriaTitle}"` : 'criteria';
    
    toast.innerHTML = `
        <div class="toast-icon"></div>
        <div class="toast-content">
            <div class="toast-title">The ${displayTitle} was removed</div>
            <div class="toast-actions">
                <button class="toast-undo" onclick="undoRemove()">Undo</button>
            </div>
        </div>
        <button class="toast-close" onclick="hideToast()">×</button>
    `;
    
    // Guardar datos para el undo
    window.lastRemovedCriteria = {
        criteria: removedCriteria,
        index: removedIndex
    };
    
    document.body.appendChild(toast);
    
    // Mostrar con animación
    setTimeout(() => {
        toast.classList.add('show');
        // Hacer blink del panel investment criteria dynamic
        blinkInvestmentPanel();
    }, 10);
    
    // Auto-hide después de 5 segundos
    toastTimeout = setTimeout(() => {
        hideToast();
    }, 5000);
}

function hideToast() {
    const undoToast = document.getElementById('undo-toast');
    const editToast = document.getElementById('edit-toast');
    const removeToast = document.getElementById('remove-toast');
    
    [undoToast, editToast, removeToast].forEach(toast => {
        if (toast) {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    });
    
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }
}

function undoLastCriteria() {
    if (allCriteria.length > 0) {
        // Eliminar el último criterio (el que se acaba de crear)
        allCriteria.pop();
        
        // Si no quedan criterios, resetear todo
        if (allCriteria.length === 0) {
            currentCriteriaIndex = 0;
        } else {
            // Si el índice actual apunta al criterio eliminado o más allá, 
            // ir al último criterio disponible
            if (currentCriteriaIndex >= allCriteria.length) {
                currentCriteriaIndex = allCriteria.length - 1;
            }
            // Si estábamos en un criterio anterior, mantener la posición
        }
        
        // Actualizar visualización
        updateInvestmentCriteriaDisplay();
        
        // Hacer blink del panel
        setTimeout(() => {
            blinkInvestmentPanel();
        }, 100);
        
        // Ocultar toast
        hideToast();
    }
}

function undoEdit() {
    if (previousCriteriaState && allCriteria[currentCriteriaIndex]) {
        // Restaurar el estado anterior
        allCriteria[currentCriteriaIndex] = JSON.parse(JSON.stringify(previousCriteriaState));
        
        // Actualizar visualización
        updateInvestmentCriteriaDisplay();
        
        // Hacer blink del panel
        setTimeout(() => {
            blinkInvestmentPanel();
        }, 100);
        
        // Limpiar el estado anterior
        previousCriteriaState = null;
        
        // Ocultar toast
        hideToast();
    }
}

function showRemoveConfirmation() {
    // Mostrar el mensaje de confirmación debajo de los botones
    document.getElementById('remove-confirmation').style.display = 'block';
    
    // Hacer scroll para ver todo el div de confirmación + bottom padding
    setTimeout(() => {
        const confirmationElement = document.getElementById('remove-confirmation');
        if (confirmationElement) {
            // Scroll hasta mostrar todo el mensaje con padding extra
            confirmationElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'end'
            });
            
            // Scroll adicional para mostrar el bottom padding
            setTimeout(() => {
                window.scrollBy({
                    top: 50,
                    behavior: 'smooth'
                });
            }, 300);
        }
    }, 100);
}

function confirmRemoveCriteria() {
    if (allCriteria.length > 0 && currentCriteriaIndex < allCriteria.length) {
        // Guardar el criterio que se va a eliminar para el undo
        const removedCriteria = JSON.parse(JSON.stringify(allCriteria[currentCriteriaIndex]));
        const removedIndex = currentCriteriaIndex;
        const criteriaTitle = removedCriteria.title || 'criteria';
        
        // Eliminar el criterio actual
        allCriteria.splice(currentCriteriaIndex, 1);
        
        // Ajustar índice actual
        if (allCriteria.length === 0) {
            currentCriteriaIndex = 0;
        } else if (currentCriteriaIndex >= allCriteria.length) {
            currentCriteriaIndex = allCriteria.length - 1;
        }
        
        // Cerrar modal
        closeInvestmentModal();
        
        // Actualizar visualización
        updateInvestmentCriteriaDisplay();
        
        // Ocultar mensaje de confirmación
        document.getElementById('remove-confirmation').style.display = 'none';
        
        // Mostrar toast de eliminación
        setTimeout(() => {
            showRemoveToast(criteriaTitle, removedCriteria, removedIndex);
        }, 100);
        
        // Limpiar estado anterior
        previousCriteriaState = null;
    }
}

function undoRemove() {
    if (window.lastRemovedCriteria) {
        const { criteria, index } = window.lastRemovedCriteria;
        
        // Restaurar el criterio en su posición original
        allCriteria.splice(index, 0, criteria);
        
        // Ir al criterio restaurado
        currentCriteriaIndex = index;
        
        // Actualizar visualización
        updateInvestmentCriteriaDisplay();
        
        // Hacer blink del panel
        setTimeout(() => {
            blinkInvestmentPanel();
        }, 100);
        
        // Limpiar datos del undo
        window.lastRemovedCriteria = null;
        
        // Ocultar toast
        hideToast();
    }
}

// Función legacy mantenida por compatibilidad
function removeCriteria() {
    showRemoveConfirmation();
}

function clearModalForm() {
    // Limpiar inputs de texto
    document.getElementById('criteria-title').value = '';
    document.getElementById('criteria-description').value = '';
    document.getElementById('revenue-min').value = '';
    document.getElementById('revenue-max').value = '';
    document.getElementById('ebitda-min').value = '';
    document.getElementById('ebitda-max').value = '';
    
    // Desmarcar todos los checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[type="radio"]').forEach(rb => rb.checked = false);
}

function blinkInvestmentPanel() {
    // DIRTY: Buscar elemento y hacer scroll + blink
    const element = document.querySelector('.investment-criteria-dynamic') || 
                   document.querySelector('[class*="investment-criteria"]') ||
                   document.querySelector('[class*="criteria-dynamic"]');
    
    if (element) {
        // Scroll más suave, no tan arriba
        const rect = element.getBoundingClientRect();
        const offset = window.pageYOffset + rect.top - 200; // 200px desde arriba
        window.scrollTo(0, offset);
        
        setTimeout(() => {
            element.classList.add('criteria-highlight');
            setTimeout(() => {
                element.classList.remove('criteria-highlight');
            }, 1000);
        }, 100);
    } else {
        // Fallback: scroll fijo
        window.scrollTo(0, 600);
    }
}

// Expose functions globally
window.navigateCriteria = navigateCriteria;
window.undoLastCriteria = undoLastCriteria;
window.undoEdit = undoEdit;
window.undoRemove = undoRemove;
window.removeCriteria = removeCriteria;
window.showRemoveConfirmation = showRemoveConfirmation;
window.confirmRemoveCriteria = confirmRemoveCriteria;
window.hideToast = hideToast;
window.openNewCriteriaModal = openNewCriteriaModal;
window.handleSaveCriteria = handleSaveCriteria;
window.goToCriteria = goToCriteria;
window.navigateModalCriteria = navigateModalCriteria;
window.debugCriteriaState = debugCriteriaState;
window.testModalNavigation = testModalNavigation;
window.updateModalNavigation = updateModalNavigation;
window.createTestCriteria = createTestCriteria;
window.testAllNavigationCases = testAllNavigationCases;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('investment-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeInvestmentModal();
            }
        });
    }

    // Cargar datos iniciales al cargar la página
    loadInitialData();
});
// Additional fallback call
console.log('Script loaded, forcing loadInitialData...');
if (typeof loadInitialData === 'function') {
    setTimeout(() => {
        debugElements();
        loadInitialData();
    }, 100);
} 
