import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';

import { Link, useHistory } from 'react-router-dom';

import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

import { Map, TileLayer, Marker } from 'react-leaflet';

import { LeafletMouseEvent } from 'leaflet';

import { ToastContainer, toast } from 'react-toastify';

import axios from 'axios';

import api from '../../services/api';

import './styles.css';

import logo from '../../assets/logo.svg';

interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface IBGEUFResponse {
    sigla: string;
    nome: string;
}

interface Uf {
    initials: string;
    name: string;
}

interface IBGECityResponse {
    nome: string;
}

const CreatePoint = () => {

    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<Uf[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);

    const [selectedUf, setSelectedUf] = useState("0");
    const [selectedCity, setSelectedCity] = useState("0");

    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const [inputData, setInputData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });

    const [created, setCreated] = useState<boolean>(false);

    const history = useHistory();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setInitialPosition([latitude, longitude]);
        });
    }, []);

    useEffect(() => {

        api.get('/items')
            .then(response => setItems(response.data));
    }, []);

    useEffect(() => {

        axios.get<IBGEUFResponse[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
            .then(response => {
                const ufsInitials = response.data.map(uf => {
                    return {
                        initials: uf.sigla,
                        name: uf.nome
                    }
                });

                setUfs(ufsInitials);
            });

    }, []);

    useEffect(() => {

        if (selectedUf === "0") {
            return;
        }

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                const nameCities = response.data.map(city => city.nome);

                setCities(nameCities);
            });

    }, [selectedUf]);

    const handleSelectUF = (event: ChangeEvent<HTMLSelectElement>) => setSelectedUf(event.target.value);
    const handleSelectCity = (event: ChangeEvent<HTMLSelectElement>) => setSelectedCity(event.target.value);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {

        const { name, value } = event.target;

        setInputData({ ...inputData, [name]: value });

    }

    const handleMapClick = (event: LeafletMouseEvent) => setSelectedPosition([
        event.latlng.lat,
        event.latlng.lng
    ]);

    const handleSelectItem = (id: number) => {

        const alreadySelected = selectedItems.findIndex(item => item === id);

        if (alreadySelected >= 0) {

            const filteredItems = selectedItems.filter(item => item !== id);

            setSelectedItems(filteredItems);

        } else {
            setSelectedItems([...selectedItems, id])
        }

    }

    const handleSubmit = async (event: FormEvent) => {

        event.preventDefault();

        const { name, email, whatsapp } = inputData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;

        if (!name.trim()) {
            return toast.error("Informe o nome!");
        }

        if (!email.trim()) {
            return toast.error("Informe o email!");
        }

        if (!whatsapp.trim()) {
            return toast.error("Informe o whatsapp!");
        }

        if (!uf.trim()) {
            return toast.error("Informe a UF!");
        }

        if (!city.trim()) {
            return toast.error("Informe a cidade!");
        }

        if (!latitude || !longitude) {
            return toast.error("Informe uma localização no mapa!");
        }

        if (items.length == 0) {
            return toast.error("Informe ao menos 1 item de coleta!");
        }

        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items
        }

        await api.post('/points', data);

        setCreated(true);

        setTimeout(() => history.push('/'), 2000);

    }

    if (created) {
        return (
            <div id="created">
                <FiCheckCircle size={42} color="#34CB79" />
                <span>Cadastro concluído!</span>
                <span id="muted">Aguarde...</span>
            </div>
        )
    }

    return (
        <div id="page-create-point">
            <header>
                <img alt="Ecoleta" src={logo} />
                <Link to="/">
                    <FiArrowLeft />
                Voltar para home
            </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br />ponto de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            autoComplete="off"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                autoComplete="off"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                autoComplete="off"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map
                        center={initialPosition}
                        zoom={15}
                        onClick={handleMapClick}
                    >
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">UF</label>
                            <select
                                onChange={handleSelectUF}
                                value={selectedUf}
                                name="uf"
                                id="uf">
                                <option value="0">Selecione a UF</option>
                                {ufs.map(uf => (
                                    <option key={uf.initials} value={uf.initials}>{uf.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select
                                onChange={handleSelectCity}
                                value={selectedCity}
                                name="city"
                                id="city">
                                <option value="">Selecione a cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais ítens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => (
                            <li
                                key={item.id}
                                className={selectedItems.includes(item.id) ? "selected" : ""}
                                onClick={() => handleSelectItem(item.id)}>
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>
                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
            <ToastContainer position="top-center" toastClassName="toast-error" />
        </div>
    )
}

export default CreatePoint;
