document.addEventListener('DOMContentLoaded', () => {
    const yearSelect = document.getElementById('year');
    const brandSelect = document.getElementById('brand');
    const modelSelect = document.getElementById('model');
    const versionSelect = document.getElementById('version');
    const priceDisplay = document.getElementById('priceDisplay');
    const getPriceButton = document.getElementById('getPrice');

    loadYears(); // Cargar años al inicio

    yearSelect.addEventListener('change', async () => {
        const year = yearSelect.value;
        if (year) {
            await loadBrands();
            modelSelect.disabled = true; // Deshabilitar modelos
            versionSelect.disabled = true; // Deshabilitar versiones
            getPriceButton.disabled = true; // Deshabilitar botón de obtener precio
        }
    });

    brandSelect.addEventListener('change', async () => {
        const brand = brandSelect.value;
        if (brand) {
            await loadModels(brand);
            versionSelect.disabled = true; // Deshabilitar versiones
            getPriceButton.disabled = true; // Deshabilitar botón de obtener precio
        }
    });

    modelSelect.addEventListener('change', async () => {
        const model = modelSelect.value;
        if (model) {
            const year = yearSelect.value;
            await loadVersions(year, brandSelect.value, model);
            getPriceButton.disabled = false; // Habilitar botón de obtener precio
        }
    });

    versionSelect.addEventListener('change', async () => {
        const year = yearSelect.value;
        const brand = brandSelect.value;
        const model = modelSelect.value;
        const version = versionSelect.value;
        const price = await getPrice(year, brand, model, version);
        priceDisplay.innerText = `Precio: $${price}`;
    });

    getPriceButton.addEventListener('click', async () => {
        const year = yearSelect.value;
        const brand = brandSelect.value;
        const model = modelSelect.value;
        const version = versionSelect.value;
        const price = await getPrice(year, brand, model, version);
        priceDisplay.innerText = `Precio: $${price}`;
    });

    async function loadYears() {
        yearSelect.innerHTML = '<option value="">Selecciona un año</option>'; // Opción predeterminada
        for (let year = 2024; year >= 1974; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        }
    }

    async function loadBrands() {
        try {
            const response = await fetch('https://api.mercadolibre.com/categories/MLA1744/attributes');
            if (!response.ok) {
                throw new Error('Error al cargar las marcas');
            }
            const attributes = await response.json();
            const brands = attributes.find(attr => attr.name.toLowerCase() === 'marca');
            
            brandSelect.innerHTML = '<option value="">Selecciona una marca</option>'; // Opción predeterminada
            if (brands && brands.values.length > 0) {
                brands.values.forEach(brand => {
                    const option = document.createElement('option');
                    option.value = brand.name;
                    option.textContent = brand.name;
                    brandSelect.appendChild(option);
                });
                brandSelect.disabled = false; // Habilitar el select de marcas
            } else {
                brandSelect.disabled = true; // Deshabilitar si no hay opciones
            }
        } catch (error) {
            console.error('Error al cargar las marcas:', error);
            alert('Error al cargar las marcas');
        }
    }

    async function loadModels(brand) {
        try {
            const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${brand}?format=json`);
            if (!response.ok) {
                throw new Error('Error al cargar los modelos');
            }
            const data = await response.json();
            const models = data.Results;

            modelSelect.innerHTML = '<option value="">Selecciona un modelo</option>'; // Opción predeterminada
            if (models && models.length > 0) {
                models.forEach(model => {
                    const option = document.createElement('option');
                    option.value = model.Model_Name;
                    option.textContent = model.Model_Name;
                    modelSelect.appendChild(option);
                });
                modelSelect.disabled = false; // Habilitar el select de modelos
            } else {
                modelSelect.disabled = true; // Deshabilitar si no hay opciones
            }
        } catch (error) {
            console.error('Error al cargar los modelos:', error);
            alert('Error al cargar los modelos');
        }
    }

    async function loadVersions(year, brand, model) {
        try {
            const response = await fetch(`https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${year}&make=${brand}&model=${model}`);
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const textData = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(textData, "text/xml");

            const menuItems = xmlDoc.getElementsByTagName("menuItem");
            versionSelect.innerHTML = '<option value="">Selecciona una versión</option>'; // Opción predeterminada

            if (menuItems.length > 0) {
                Array.from(menuItems).forEach(item => {
                    const text = item.getElementsByTagName("text")[0].textContent;
                    const value = item.getElementsByTagName("value")[0].textContent;

                    const option = document.createElement('option');
                    option.value = value;
                    option.textContent = text;
                    versionSelect.appendChild(option);
                });
                versionSelect.disabled = false; // Habilitar el select de versiones
            } else {
                versionSelect.disabled = true; // Deshabilitar si no hay opciones
                showNoVersionsPopup(year, brand, model); // Mostrar pop-up si no hay versiones
            }
        } catch (error) {
            console.error('Error al cargar las versiones:', error);
            alert(`Error al cargar las versiones: ${error.message}`);
        }
    }

    function showNoVersionsPopup(year, brand, model) {
        const message = `No tenemos disponible ninguna versión para cotizar para el Año: ${year}, Marca: ${brand}, Modelo: ${model}. Estamos trabajando para mejorar nuestras herramientas y en breve puedas cotizar también la versión que estas buscando.`;
        alert(message); // Usamos un alert simple, pero puedes usar una librería de pop-ups si prefieres algo más estilizado
    }

    async function getPrice(year, brand, model, version) {
        // Aquí iría tu lógica para obtener el precio
        // Este es un ejemplo ficticio
        return Math.floor(Math.random() * 20000) + 10000; // Precio aleatorio entre 10,000 y 30,000
    }
});
