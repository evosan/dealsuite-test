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
function openInvestmentModal() {
    // Marcar que estamos editando un criterio existente
    isEditingExisting = true;
    
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
                <h2>Investment Criteria ${canAddMore ? `<a href="#" id="add-criteria-link" onclick="openNewCriteriaModal(); return false;">Add criteria</a>` : ''}</h2>
                <button class="edit-icon-btn" onclick="openInvestmentModal()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 20.0001H20M4 20.0001V16.0001L14.8686 5.13146L14.8704 5.12976C15.2652 4.73488 15.463 4.53709 15.691 4.46301C15.8919 4.39775 16.1082 4.39775 16.3091 4.46301C16.5369 4.53704 16.7345 4.7346 17.1288 5.12892L18.8686 6.86872C19.2646 7.26474 19.4627 7.46284 19.5369 7.69117C19.6022 7.89201 19.6021 8.10835 19.5369 8.3092C19.4628 8.53736 19.265 8.73516 18.8695 9.13061L18.8686 9.13146L8 20.0001L4 20.0001Z" stroke="#6B9286" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>`;
        
        // Mostrar mensaje de límite alcanzado si es necesario
        if (!canAddMore) {
            html += `<div class="max-criteria-message">Maximum of 10 criteria reached.</div>`;
        }
            
        // Agregar título y descripción del criterio actual con navegación
        const currentCriteria = getCurrentCriteria();
        if (currentCriteria && currentCriteria.title) {
            const showLeftArrow = currentCriteriaIndex > 0;
            const showRightArrow = currentCriteriaIndex < allCriteria.length - 1;
            
            // Container para la navegación completa
            html += `<div class="criteria-navigation-container">
                ${showLeftArrow ? `<button class="nav-arrow nav-left" onclick="navigateCriteria(-1)">‹</button>` : '<div class="nav-placeholder"></div>'}
                <div class="criteria-title-description">
                    <div class="criteria-title-display">
                        <h3>Title ${currentCriteria.title}</h3>
                    </div>`;
            if (currentCriteria.description) {
                html += `<div class="criteria-description-display">
                        <span>${currentCriteria.description}</span>
                    </div>`;
            }
            html += `</div>
                ${showRightArrow ? `<button class="nav-arrow nav-right" onclick="navigateCriteria(1)">›</button>` : '<div class="nav-placeholder"></div>'}
            </div>`;
            
            // Agregar puntos de paginación
            if (allCriteria.length > 1) {
                html += `<div class="criteria-pagination">`;
                for (let i = 0; i < allCriteria.length; i++) {
                    html += `<span class="pagination-dot ${i === currentCriteriaIndex ? 'active' : ''}" onclick="goToCriteria(${i})"></span>`;
                }
                html += `</div>`;
            }
        }
        
        html += `<div class="criteria-display-grid">`;
        
        // Growth Percentage (Top Left)
        if (currentCriteria.growth.length > 0) {
            html += '<div class="criteria-card"><h4>Growth Percentage</h4><ul>';
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

        // Countries (Top Right)
        if (currentCriteria.countries.length > 0) {
            html += '<div class="criteria-card"><h4>Countries</h4><ul>';
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
                // Mostrar exactamente lo que está seleccionado en la modal
                html += `<li>${labels[country] || country}</li>`;
            });
            html += '</ul></div>';
        } else {
            html += '<div class="criteria-card empty"></div>';
        }

        // Other Information (Bottom Left)
        if (currentCriteria.profitability.length > 0 || currentCriteria.equity.length > 0) {
            html += '<div class="criteria-card other-info-card"><h4>Other information</h4>';
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

            // Company Size (Bottom Right)
            if (currentCriteria.revenueMin || currentCriteria.revenueMax || 
                currentCriteria.ebitdaMin || currentCriteria.ebitdaMax) {
                html += '<div class="criteria-card company-size-card"><h4>Company size</h4>';
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
            // Si no hay Other Information, mostrar Company Size en bottom left
            html += '<div class="criteria-card empty"></div>';
            if (currentCriteria.revenueMin || currentCriteria.revenueMax || 
                currentCriteria.ebitdaMin || currentCriteria.ebitdaMax) {
                html += '<div class="criteria-card company-size-card"><h4>Company size</h4>';
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
        }
        
        // Cerrar el grid
        html += '</div>';

        // Sectors - Full Width Section (fuera del grid)
        if (currentCriteria.sectors.length > 0) {
            html += '<div class="sectors-section"><h4>Sectors <button class="edit-icon-btn" onclick="openInvestmentModal()"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 20.0001H20M4 20.0001V16.0001L14.8686 5.13146L14.8704 5.12976C15.2652 4.73488 15.463 4.53709 15.691 4.46301C15.8919 4.39775 16.1082 4.39775 16.3091 4.46301C16.5369 4.53704 16.7345 4.7346 17.1288 5.12892L18.8686 6.86872C19.2646 7.26474 19.4627 7.46284 19.5369 7.69117C19.6022 7.89201 19.6021 8.10835 19.5369 8.3092C19.4628 8.53736 19.265 8.73516 18.8695 9.13061L18.8686 9.13146L8 20.0001L4 20.0001Z" stroke="#6B9286" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></h4>';
            html += '<div class="sectors-tags-display">';
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

        investmentDynamic.innerHTML = html;
    } else {
        // Si no hay criterios, mostrar placeholder con header
        const canAddMore = allCriteria.length < MAX_CRITERIA;
        investmentDynamic.innerHTML = `
            <div class="section-header">
                <h2>Investment Criteria ${canAddMore ? `<a href="#" id="add-criteria-link" onclick="openNewCriteriaModal(); return false;">Add criteria</a>` : ''}</h2>
                <button class="edit-icon-btn" onclick="openInvestmentModal()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 20.0001H20M4 20.0001V16.0001L14.8686 5.13146L14.8704 5.12976C15.2652 4.73488 15.463 4.53709 15.691 4.46301C15.8919 4.39775 16.1082 4.39775 16.3091 4.46301C16.5369 4.53704 16.7345 4.7346 17.1288 5.12892L18.8686 6.86872C19.2646 7.26474 19.4627 7.46284 19.5369 7.69117C19.6022 7.89201 19.6021 8.10835 19.5369 8.3092C19.4628 8.53736 19.265 8.73516 18.8695 9.13061L18.8686 9.13146L8 20.0001L4 20.0001Z" stroke="#6B9286" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
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
    if (newIndex >= 0 && newIndex < allCriteria.length) {
        currentCriteriaIndex = newIndex;
        updateInvestmentCriteriaDisplay();
    }
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

// Expose functions globally
window.navigateCriteria = navigateCriteria;
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