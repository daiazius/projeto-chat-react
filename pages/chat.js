import { Box, Button, Text, TextField, Image, Icon } from '@skynexui/components';
import appConfig from '../config.json'
import React from 'react';

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

export default function paginaDoChat() {
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

    function handlerNovaMensagem(novaMensagem) {
        const mensagem = {
            texto: novaMensagem,
            autor: 'daiazius',
            id: listaDeMensagens.length
        }
        setListaDeMensagens([
            mensagem,
            ...listaDeMensagens
        ])
        setMensagem('');
    }

    function apagarMensagem(id){
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
        >
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
                                if (event.key === 'Enter') {
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
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5' styleSheet={{fontFamily: 'Press Start 2P', fontSize: '20px'}}>
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
                                src={`https://github.com/daiazius.png`}
                            />
                            <Text tag="strong" styleSheet={{fontFamily: 'Press Start 2P', fontSize: '15px'}}>
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
                            {/* <Button 
                                iconName='FaTimes'
                                variant='tertiary'
                                colorVariant='dark'
                                styleSheet={{
                                    padding: '10px'
                                }}
                            /> */}
                            <Botaozin apagas={props.apagas} value={props.mensagens} id={mensagem.id}>x</Botaozin>
                        </Box>
                        {mensagem.texto}
                    </Text>
                );
            })}
        </Box>
    )
}