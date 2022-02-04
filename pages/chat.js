import { Box, Button, Text, TextField, Image, Icon } from '@skynexui/components';
import appConfig from '../config.json'
import React, { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import * as ReactBootStrap from 'react-bootstrap';
import ReactTooltip from 'react-tooltip';
import { useRouter } from 'next/router';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker'

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzU4NzEwNywiZXhwIjoxOTU5MTYzMTA3fQ.LGChthqr-cKV7wKbYA_IMFI9xg2cGQaod6GEu-TEwFk'
const SUPABASE_URL = 'https://mntdwtqrxpdfiruzkuky.supabase.co'
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function oEscutas(adicionaMensagem) {
    return supabaseClient
        .from('mensagens')
        .on('INSERT', (respostaLive) => {
            adicionaMensagem(respostaLive.new);
        })
        .subscribe();
}

// Render
export default function paginaDoChat() {
    const roteamento = useRouter();
    const usuarioLogado = roteamento.query.username;
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        supabaseClient
            .from('mensagens')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
                console.log('Consulta: ', data);
                setListaDeMensagens(data);
            });
        setLoading(true);
        oEscutas((novaMensagem) => {
            setListaDeMensagens((valorAtualDaLista) => {
                return  [
                    novaMensagem,
                    ...valorAtualDaLista
                ]
            })
        });
    }, [])

    function handlerNovaMensagem(novaMensagem) {
        const mensagem = {
            texto: novaMensagem,
            autor: usuarioLogado,
        }

        supabaseClient
            .from('mensagens')
            .insert([mensagem])
            .then(({ data }) => {
                
            })

        setMensagem('');
    }

    async function apagarMensagem(id) {
        console.log(id);
        await supabaseClient
            .from('mensagens')
            .delete()
            .eq('id', id);
        setListaDeMensagens(listaDeMensagens.filter((mensagem) => {
            return id != mensagem.id;
        }));
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                //    backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://wallpaperaccess.com/full/1089608.png)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >{loading ?
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    <MessageList apagas={apagarMensagem} mensagens={listaDeMensagens} />
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter' && mensagem.lenght() > 0) {
                                    event.preventDefault();
                                    handlerNovaMensagem(mensagem);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <Button
                            label='Enviar'
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals['000'],
                                mainColor: appConfig.theme.colors.neutrals[400],
                                mainColorLight: appConfig.theme.colors.neutrals[350],
                                mainColorStrong: appConfig.theme.colors.neutrals[450]
                            }}
                            styleSheet={{
                                marginBottom: '8px'
                            }}
                            onClick={() => {
                                handlerNovaMensagem(mensagem);
                            }}
                        />
                        <ButtonSendSticker onStickerClick={(sticker) => handlerNovaMensagem(`:sticker:${sticker}`)} />
                    </Box>
                </Box>
            </Box> : <ReactBootStrap.Spinner animation='border' />}
        </Box>
    )
}

// Componentes

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5' styleSheet={{ fontFamily: 'Press Start 2P', fontSize: '20px' }}>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {

    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            fontFamily: 'Press Start 2P',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.autor}.png`}
                                data-tip data-for='teste'
                            />
                            <ReactTooltip id='teste' effect='solid' >
                                <UserInfo username={mensagem.autor}></UserInfo>
                            </ReactTooltip>
                            <Text tag="strong" styleSheet={{ fontFamily: 'Press Start 2P', fontSize: '15px' }}>
                                {mensagem.autor}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontFamily: 'Press Start 2P',
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                            <Botaozin apagas={props.apagas} value={props.mensagens} id={mensagem.id}>x</Botaozin>
                        </Box>
                        {mensagem.texto.startsWith(':sticker:')
                            ? (
                                <Image styleSheet={{ maxWidth: '100px' }} src={mensagem.texto.replace(':sticker:', '')} />
                            )
                            : (
                                mensagem.texto
                            )}
                    </Text>
                );
            })}
        </Box>
    )
}

function Botaozin(props) {
    const id = props.id;
    return (
        <>
            <button onClick={() => {
                props.apagas(id);
            }}>{props.children}</button>
            <style jsx>{`
                button {
                    background-color: #f44336;
                    border: none;
                    color: white;
                    padding: 5px 7px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    margin-left: 1600px;
                }
            `}</style>
        </>
    );
}

function UserInfo({ username }) {
    const [userInfo, setUserInfo] = React.useState({});

    async function fetchUserInfo(username) {
        const resposta = await fetch(`https://api.github.com/users/${username}`)
        if (resposta.status === 200) {
            const dados = await resposta.json();
            return dados;
        }
        else {
            throw new Error('User not found');
        }
    }

    useEffect(() => {
        async function carregar() {
            const dados = await fetchUserInfo(username);
            setUserInfo(dados);
        }
        carregar();
    }, [username])

    return (
        <>
            <Image
                styleSheet={{
                    height: '155px',
                    width: '155px',
                    padding: '25px',
                    borderRadius: '50%'

                }}
                src={`https://github.com/${userInfo.login}.png`} />
            <Text
                variant="body4"
                styleSheet={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: appConfig.theme.colors.neutrals[200],
                    backgroundColor: appConfig.theme.colors.neutrals[900],
                    padding: '3px 10px',
                    borderRadius: '1000px'
                }}
            >
                {userInfo.name}
            </Text>
            <Text
                variant="body4"
                styleSheet={{
                    display: 'flex',
                    gap: '0.5rem',
                    color: appConfig.theme.colors.neutrals[200],
                    backgroundColor: appConfig.theme.colors.neutrals[900],
                    padding: '3px 10px',
                    borderRadius: '1000px'
                }}
            >
                <Icon name="FaMapMarkedAlt" size="2.0ch" />
                {userInfo.location}
            </Text>
        </>
    );
}
