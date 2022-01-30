import { Box, Button, Text, TextField, Image, Icon } from '@skynexui/components';
import appConfig from '../config.json'
import React from 'react';
import { useRouter } from 'next/router'
import _ from 'underscore';

// Componentes
function Titulo(props) {
    const Tag = props.tag || "h1"
    return (
        <>
            <Tag>{props.children}</Tag>
            <style jsx>{`
            ${Tag} {
                color: ${appConfig.theme.colors.neutrals['100']}
            }
            `}
            </style>
        </>
    );

}

// Funções auxiliares
function getGithubData(username) {
    return fetch(`https://api.github.com/users/${username}`)
    .then((resposta) => resposta.json()
    .then((dado) => {
        return {
            nome: dado.name,
            local: dado.location
        }
    })
    )
}

// Render
export default function PaginaInicial() {
    const [username, setUsername] = React.useState('');
    const [showImg, setShowImg] = React.useState(false);
    const [dadosUser, setDadosUser] = React.useState({});
    const roteamento = useRouter();

    const muda = (value) => {
        getGithubData(value).then((data) => {
            setDadosUser({...data})
        })
    }
    const debounceResults = _.debounce(muda, 100)
    const debounceOnChange = React.useCallback(debounceResults,[])

    return (
        <>
            <Box
                styleSheet={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  //  backgroundColor: appConfig.theme.colors.primary[500],
                    backgroundImage: 'url(https://wallpaperaccess.com/full/1089608.png)',
                    backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                }}
            >
                <Box
                    styleSheet={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: {
                            xs: 'column',
                            sm: 'row',
                        },
                        width: '100%', maxWidth: '700px',
                        //borderRadius: '5px',
                        padding: '32px', margin: '16px',
                        boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                        backgroundColor: appConfig.theme.colors.primary[900],
                    }}
                >
                    {/* Formulário */}
                    <Box
                        as="form"
                        onSubmit={function (event){
                            //Para o Refresh da página
                            event.preventDefault();
                            //Coloca nova página na pilha de roteamento
                            roteamento.push('/chat');
                        }}
                        styleSheet={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '32px',
                        }}
                    >
                        <Titulo tag="h2">Boas vindas de volta!</Titulo>
                        <Text variant="body3" styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.neutrals[300] }}>
                            {appConfig.name}
                        </Text>

                        <TextField
                            value = {username}
                            onChange = { function (event){
                                //Pega valor
                                const valor = event.target.value;
                                //Altera valor
                                setUsername(valor);
                                //Mostrar imagem somente se o nome de usuario possuir 2 caracteres ou mais
                                if(valor.length >= 2){
                                    setShowImg(true);
                                    debounceOnChange(valor);
                                }
                                else{
                                    setShowImg(false);
                                }

                            }}
                            fullWidth
                            textFieldColors={{
                                neutral: {
                                    textColor: appConfig.theme.colors.neutrals[200],
                                    mainColor: appConfig.theme.colors.neutrals[900],
                                    mainColorHighlight: appConfig.theme.colors.primary[500],
                                    backgroundColor: appConfig.theme.colors.neutrals[800],
                                },
                            }}
                        />
                        <Button
                            type='submit'
                            label='Entrar'
                            fullWidth
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.primary[210],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.primary[220],
                            }}
                        />
                    </Box>
                    {/* Formulário */}


                    {/* Photo Area */}
                    <Box
                        styleSheet={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            maxWidth: '200px',
                            padding: '16px',
                            backgroundColor: appConfig.theme.colors.neutrals[800],
                            border: '1px solid',
                            borderColor: appConfig.theme.colors.neutrals[999],
                          //borderRadius: '10px',
                            flex: 1,
                            minHeight: '240px',
                        }}
                    >
                        { showImg ? <Image styleSheet={{marginBottom: '16px'}} src={`https://github.com/${username}.png`} /> : null}
                        { showImg ? <Text
                            variant="body4"
                            styleSheet={{
                                display:'flex',
                                gap:'0.5rem',
                                color: appConfig.theme.colors.neutrals[200],
                                backgroundColor: appConfig.theme.colors.neutrals[900],
                                padding: '3px 10px',
                                borderRadius: '1000px'
                            }}
                        >
                            {dadosUser.nome}
                        </Text> : null}
                        { showImg ? <Text
                            variant="body4"
                            styleSheet={{
                                display:'flex',
                                alignItems: 'center',
                                gap:'0.5rem',
                                color: appConfig.theme.colors.neutrals[200],
                                backgroundColor: appConfig.theme.colors.neutrals[900],
                                padding: '3px 10px',
                                borderRadius: '1000px'
                            }}
                        >
                            <Icon name="FaGithub" size="2.0ch"/> {username}
                        </Text> : null}
                        { showImg ? <Text
                            variant="body4"
                            styleSheet={{
                                display:'flex',
                                alignItems: 'center',
                                gap:'0.5rem',
                                color: appConfig.theme.colors.neutrals[200],
                                backgroundColor: appConfig.theme.colors.neutrals[900],
                                padding: '3px 10px',
                                borderRadius: '1000px'
                            }}
                        >
                            <Icon name="FaMapMarkedAlt" size="2.0ch"/> {dadosUser.local}
                        </Text> : null}
                    </Box>
                    {/* Photo Area */}
                </Box>
            </Box>
        </>
    );
}