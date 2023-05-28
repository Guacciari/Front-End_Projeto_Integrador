import React, { useEffect } from "react";
import { Typography, Grid, Button } from '@material-ui/core';
import { Box } from '@mui/material';
import './Home.css';
import TabProduto from "../../components/produtos/tabProduto/TabProduto";
import ModalProduto from "../../components/produtos/modalProduto/ModalProduto";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { TokenState } from "../../store/tokens/tokensReducer";

function Home() {
    let navigate = useNavigate();
    const token = useSelector<TokenState, TokenState["tokens"]>(
        (state) => state.tokens
    );

    useEffect(() => {
        if (token == "") {
            alert("Você precisa estar logado")
            navigate("/login")

        }
    }, [token])
    return (
        < >
            <Grid container direction="row" justifyContent="center" alignItems="center" style={{ backgroundColor: "#14c3a2" }}>
                <Grid alignItems="center" item xs={6}>
                    <Box paddingX={10} >
                        <Typography variant="h3" gutterBottom color="textPrimary" component="h3" align="center" style={{ color: "white", fontWeight: "bold" }}>Seja bem vindo(a)!</Typography>
                        <Typography variant="h5" gutterBottom color="textPrimary" component="h5" align="center" style={{ color: "white", fontWeight: "bold" }}>Cadastre seus alimentos e venda conosco!</Typography>
                    </Box>
                    <Box display="flex" justifyContent="center">
                        <Box marginRight={1}>
                            <ModalProduto />
                        </Box>
                        <Link to="/produtos" className="text-decoration-none">
                        <Button variant="outlined" style={{ borderColor: "#595b5a", backgroundColor: "#7cf49a", color: "#595b5a" }}>
                            Ver Produtos
                        </Button>
                        </Link>
                    </Box>
                </Grid>
                <Grid item xs={6} >
                    <img src="https://raw.githubusercontent.com/TerraVerdePI/Front-End_Projeto_Integrador/35a693784fbd471d6eec42f58e4d70af7676d7fc/src/assets/frutasHome.png" alt="" width="700px" height="500px"  />
                </Grid>
                <Grid xs={12} className='produtos'>
                    <TabProduto />
                </Grid>
            </Grid>

        </>
    );
}

export default Home;