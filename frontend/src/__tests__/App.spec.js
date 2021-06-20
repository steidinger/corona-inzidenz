import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {screen, render, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import mockData from './data.json';

import App from '../App.js';

const dataUrl = 'https://serverless-corona-inzidenz-269004290177-dev.s3.eu-central-1.amazonaws.com/data.json';

const server = setupServer();

describe('App', () => {

    beforeAll(() => server.listen());

    afterAll(() => server.close());

    it('should display an error message if data cannot be loaded', async () => {
        server.use(
            rest.get(dataUrl, (req, res, ctx) => {
                return res(ctx.status(400));
            }),
        );
        render(<App />);
        await waitFor(() => screen.getByText(/Daten konnten nicht geladen werden/));
    });

    it('should allow adding a county to the dashboard and display its data', async () => {
        server.use(
            rest.get(dataUrl, (req, res, ctx) => {
                return res(ctx.json(mockData));
            }),
        );
        render(<App />);
        await userEvent.click(screen.getByRole("button", {name: 'Kreis auswählen'}));
        await waitFor(() => screen.getByText('Angezeigte Kreise auswählen'));
        await waitFor(() => screen.getByText('SK Stuttgart'));        
        await userEvent.click(screen.getByText('SK Stuttgart'));
        await userEvent.click(screen.getByRole("button", {name: 'OK'}));

        await waitFor(() => screen.getByTitle('aktuelle Inzidenz'));
        expect(screen.getByTitle('aktuelle Inzidenz')).toHaveTextContent('16');
        expect(screen.getByTitle('Änderung gegenüber Vortag')).toHaveTextContent('-4');
        expect(screen.getByTitle('Änderung gegenüber Vortag in Prozent')).toHaveTextContent('19');
    })
});
