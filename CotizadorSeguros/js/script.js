document.addEventListener('DOMContentLoaded', () => {
    const yearSelect = document.getElementById('year');
    const brandSelect = document.getElementById('brand');
    const modelSelect = document.getElementById('model');
    const versionSelect = document.getElementById('version');
    const priceDisplay = document.getElementById('priceDisplay');
    const sumaAseguradaInput = document.getElementById('sumaAsegurada');
    const getPriceButton = document.getElementById('getPrice');
    const isNewContainer = document.getElementById('isNewContainer');
    const isNewSelect = document.getElementById('isNew');

    let baseValueFixed = null; // Variable para almacenar la suma asegurada fija

    // Lógica para mostrar u ocultar el campo "¿Es 0KM?" dependiendo del año seleccionado
    yearSelect.addEventListener("change", function () {
        const selectedYear = parseInt(this.value);
        const currentYear = new Date().getFullYear();

        if (selectedYear === currentYear) {
            isNewContainer.style.display = "block"; // Mostrar "¿Es 0KM?"
        } else {
            isNewContainer.style.display = "none"; // Ocultar "¿Es 0KM?"
            isNewSelect.value = "no"; // Reiniciar la selección a "no"
        }
    });

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

        if (version) {
            const price = await getPrice(year, brand, model, version);
            priceDisplay.innerText = `Precio Base sin Adicionales: $${price/10}`;

            // Calcular y fijar la Suma Asegurada
            const sumaAsegurada = price * 1.2 * 10; // Ejemplo: 20% más del precio como suma asegurada
            sumaAseguradaInput.value = `$${sumaAsegurada.toFixed(2)}`;
            baseValueFixed = sumaAsegurada; // Guardar la suma asegurada fija
        }
    });

    getPriceButton.addEventListener('click', () => {
        if (baseValueFixed === null) {
            alert('Por favor, seleccione primero la versión para obtener la Suma Asegurada.');
            return;
        }

        // Variables para el cálculo del precio final
        let finalPrice = baseValueFixed;
        const year = parseInt(yearSelect.value);
        const is0KM = isNewSelect.value === 'yes';
        const hasGNC = document.getElementById('gnc').value === 'yes';
        const hasTracking = document.getElementById('tracking').value === 'yes';
        const adjustmentClause = parseInt(document.getElementById('adjustmentClause').value);
        const vehicleUse = document.getElementById('vehicleUse').value;
        const coveragePlan = document.getElementById('coverageType').value;

        // Cálculo de depreciación por año
        const currentYear = new Date().getFullYear();
        const age = currentYear - year;
        const depreciation = (age > 0) ? 0.02 * age : 0; // Depreciación del 2% por año
        finalPrice -= finalPrice * depreciation;

        // Aplicar factores adicionales
        if (is0KM) finalPrice += finalPrice * 0.10; // 10% extra por ser 0KM
        if (hasGNC) finalPrice += finalPrice * 0.05; // 5% extra por tener GNC
        if (hasTracking) finalPrice -= finalPrice * 0.03; // 3% descuento por equipo de rastreo

        // Ajuste por cláusula de ajuste
        finalPrice += finalPrice * (adjustmentClause / 100);

        // Ajuste por uso del vehículo
        if (vehicleUse === 'commercial') finalPrice += finalPrice * 0.15; // 15% extra por uso comercial

        // Ajuste según el plan de cobertura
        switch (coveragePlan) {
            case 'planA':
                finalPrice += 0; // Sin costo adicional
                break;
            case 'planB':
                finalPrice += finalPrice * 0.20; // 20% extra para "Todo Total"
                break;
            case 'planC':
                finalPrice += finalPrice * 0.35; // 35% extra para "Terceros Completo"
                break;
            case 'planD':
                finalPrice += finalPrice * 0.50; // 50% extra para "Todo Riesgo"
                break;
        }

        finalPrice1 = finalPrice/4

        // Mostrar el precio final calculado
        priceDisplayFinalMensual.innerText = `Precio Final del Seguro (Mensual - 1 Cuota): $${((finalPrice1)/10).toFixed(2)}`;
        priceDisplayFinalSemestral.innerText = `Precio Final del Seguro (Semestral - 5 Cuotas): $${((finalPrice1)/2).toFixed(2)}`;
        priceDisplayFinalAnual.innerText = `Precio Final del Seguro (Anual - 10 Cuotas): $${(finalPrice1).toFixed(2)}`;
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
            }
        } catch (error) {
            console.error('Error al cargar las versiones:', error);
            alert('Error al cargar las versiones');
        }
    }

    async function getPrice(year, brand, model, version) {
        try {
            const mockPrice = Math.floor(Math.random() * (50000 - 20000 + 1) + 20000); // Generar un precio ficticio entre $20,000 y $50,000
            return mockPrice;
        } catch (error) {
            console.error('Error al obtener el precio:', error);
            alert('Error al obtener el precio');
            return 0;
        }
    }
});
