import { AppBar, MenuItem, Toolbar, IconButton, Drawer, List, ListItemText, ListItem } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useState, useEffect } from "react";
import theme from "../../assets/theme";
import { keyframes } from "@mui/system";
import logo from '../../assets/images/logos/logo.svg';

const slideDown = keyframes`
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
`;

const NavBar = () => {
    const [open, setOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('slide');
    const sections = [
        { id: 'home', label: 'Home' },
        { id: 'servicos', label: 'Serviços' },
        { id: 'fotos', label: 'Fotos' },
        { id: 'reserva', label: 'Reserva' },
        { id: 'contato', label: 'Contato' },
        { id: 'cardapio', label: 'Cardápio' },
    ];

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const handleScroll = () => {
        let foundSection = false;
        sections.forEach((section) => {
            const sectionElement = document.getElementById(section.id);
            const rect = sectionElement?.getBoundingClientRect();
            if (rect && rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                setActiveSection(section.id);
                if (window.location.hash !== `#${section.id}`) {
                    window.history.pushState(null, '', `#${section.id}`);
                }
                foundSection = true;
            }
        });

        if (!foundSection) {
            setActiveSection('home');
            if (window.location.hash !== '#home') {
                window.history.pushState(null, '', '#home');
            }
        }
    };

    useEffect(() => {
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    },);

    const handleScrollToSection = (sectionId: string) => {
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement) {
            window.scrollTo({
                top: sectionElement.offsetTop - 80,
                behavior: 'smooth',
            });
        }
    };

    const handleDrawerItemClick = (sectionId: string) => {
        handleScrollToSection(sectionId);
        handleDrawerToggle();
    };

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    boxShadow: 'none',
                    backgroundColor: 'transparent',
                    animation: `${slideDown} 0.5s ease-out`,
                }}
            >
                <Toolbar 
                    sx={{ 
                        backgroundColor: activeSection === 'home' ? 'rgba(0, 0, 0, 0.74)' : '#000000',
                        backdropFilter: 'blur(5px)',
                        animation: `${slideDown} 0.5s`,
                        padding: 3 
                    }}>
                    <img
                        src={logo}
                        alt="Logo"
                        style={{ height: "50px", cursor: 'pointer' }}
                        onClick={() => handleScrollToSection('home')}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', alignItems: 'center' }}>
                        {sections.map((section) => (
                            <>
                                <MenuItem
                                    key={section.id}
                                    sx={{
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold',
                                        marginX: 1,
                                        color: activeSection === section.id ? theme.palette.primary.main : theme.palette.secondary.main,
                                        display: { xs: 'none', lg: 'block' },
                                        transition: 'color 0.3s ease',
                                        '&:hover': {
                                            color: theme.palette.primary.main,
                                            backgroundColor: 'transparent',
                                        },
                                    }}
                                    component="a"
                                    onClick={() => handleScrollToSection(section.id)}
                                >
                                    {section.label}
                                </MenuItem>
                            </>
                        ))}
                    </div>
                    <IconButton
                        edge="end"
                        color="inherit"
                        aria-label="menu"
                        sx={{ display: { xs: 'flex', lg: 'none' }, color: 'white' }}
                        onClick={handleDrawerToggle}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="right"
                open={open}
                onClose={handleDrawerToggle}
                sx={{ display: { xs: 'block', lg: 'none' } }}
            >
                <List>
                    {sections.map((section) => (
                        <ListItem
                            key={section.id}
                            onClick={() => handleDrawerItemClick(section.id)}
                            component="div"
                            sx={{
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                color: activeSection === section.id ? theme.palette.primary.main : theme.palette.secondary.main,
                                transition: 'background-color 0.3s ease, color 0.3s ease',
                                '&:hover': {
                                    color: theme.palette.primary.main,
                                },
                            }}
                        >
                            <ListItemText primary={section.label} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </>
    );
};

export default NavBar;
