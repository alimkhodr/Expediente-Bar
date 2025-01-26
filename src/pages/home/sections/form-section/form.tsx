import React, { useState, useRef } from "react";
import { Container, TextField, MenuItem, Select, InputLabel, FormControl, styled, Typography } from "@mui/material";
import theme from "../../../../assets/theme";
import services from "../../../../assets/data/services-data";
import CircularProgress from '@mui/material/CircularProgress';
import StyledButtonGreen from "../../../../components/styled-button/styled-button-green";
import { useSnackbar } from 'notistack';

const Form = () => {
    const [loading, setLoading] = useState(false);
    const telefoneRef = useRef<HTMLInputElement>(null);
    const { enqueueSnackbar } = useSnackbar();

    const StyledForm = styled("div")(({ theme }) => ({
        display: "flex",
        alignItems: "center",
        padding: "40px 0px",
        backgroundColor: theme.palette.background.paper,
    }));

    const StyledCard = styled("div")(() => ({
        borderRadius: 5,
        border: "none",
        padding: 25,
        backgroundColor: theme.palette.background.default,
        alignItems: "center",
        margin: "20px 0",
        width: "100%",
        maxWidth: 700,
    }));

    const procedimentos = services.flatMap((service) =>
        service.items.flatMap((item) =>
            item.service.map((svc) => `${service.title} - ${svc.text}`)
        )
    );

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (telefoneRef.current && telefoneRef.current.value.length < 14) {
            enqueueSnackbar("Telefone inválido. Tente novamente.", { variant: "error" });
            setLoading(false);
            return;
        }

        setLoading(true);

        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        try {
            const response = await fetch(import.meta.env.VITE_API_FORM as string, {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json",
                },
            });

            if (response.ok) {
                enqueueSnackbar("Mensagem enviada com sucesso!", { variant: "success" });
            } else {
                enqueueSnackbar("Erro ao enviar a mensagem. Tente novamente.", { variant: "error" });
            }
        } catch (error) {
            enqueueSnackbar("Erro ao enviar a mensagem. Tente novamente.", { variant: "error" });
        }
        setLoading(false);
    };

    const handleTelefoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/\D/g, "");
        let formattedValue = value;

        if (value.length == 0) {
            formattedValue = '';
        } else if (value.length <= 2 && value.length > 0) {
            formattedValue = `(${value}`;
        } else if (value.length <= 6) {
            formattedValue = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else {
            formattedValue = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
        }

        if (telefoneRef.current && telefoneRef.current.value !== formattedValue) {
            telefoneRef.current.value = formattedValue;
        }
    };

    return (
        <StyledForm>
            <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h3" textAlign="center" fontWeight="bold">
                    Entre em contato
                </Typography>
                <Typography variant="body1" textAlign="center">
                    Preencha o Formulário
                </Typography>
                <StyledCard>
                    <form
                        name="contact-form"
                        onSubmit={handleSubmit}
                        style={{ display: "flex", gap: 15, flexDirection: "column" }}
                        action="javascript:void(0)"
                    >
                        <TextField
                            label="Nome"
                            variant="outlined"
                            fullWidth
                            name="Nome"
                            required
                        />
                        <TextField
                            label="Telefone"
                            variant="outlined"
                            fullWidth
                            name="Telefone"
                            inputRef={telefoneRef}
                            onChange={handleTelefoneChange}
                            required
                        />
                        <FormControl fullWidth>
                            <InputLabel id="procedimento-label">Procedimento</InputLabel>
                            <Select
                                labelId="procedimento-label"
                                label="Procedimento de Interesse"
                                name="Procedimento"
                                autoComplete="off"
                            >
                                {procedimentos.map((procedimento, index) => (
                                    <MenuItem key={index} value={procedimento}>
                                        {procedimento}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Mensagem"
                            variant="outlined"
                            fullWidth
                            name="Mensagem"
                            multiline
                            rows={4}
                        />
                        <StyledButtonGreen
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            endIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                            disabled={loading}
                        >
                            Enviar
                        </StyledButtonGreen>
                    </form>
                </StyledCard>
            </Container>
        </StyledForm>
    );
};

export default Form;
