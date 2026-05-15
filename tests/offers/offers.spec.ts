import { test } from '../../fixtures';
import { createAirOffer, createLandOffer, createSeaOffer } from '../../data/offer.factory';
import { OfferData } from '../../data/interfaces/offer.types';
import { OffersPage } from '../../pages/offers.page';
import { OfferDetailsPage } from '../../pages/offer-details.page';

type Pages = {
    offersPage: OffersPage;
    offerDetailsPage: OfferDetailsPage;
};

async function runOfferScenario(
    { offersPage, offerDetailsPage }: Pages,
    data: OfferData
) {
    await test.step('Step 1 │ Create Offer', async () => {
        await offersPage.createNewOffer(data);
    });

    await test.step('Step 2 │ Fill All Tabs', async () => {
        await offerDetailsPage.fillAllTabs(data);
    });
}

test.describe('Offer Module @offer', () => {
    test.setTimeout(180000);

    test('Create Air Offer - Inbound', async ({ offersPage, offerDetailsPage }) => {
        const data = createAirOffer(); 
        await runOfferScenario({ offersPage, offerDetailsPage }, data);
    });

    // test('Create Sea Offer', async ({ offersPage, offerDetailsPage }) => {
    //     const data = createSeaOffer();
    //     await runOfferScenario({ offersPage, offerDetailsPage }, data);
    // });

    // test('Create Land Offer', async ({ offersPage, offerDetailsPage }) => {
    //     const data = createLandOffer();
    //     await runOfferScenario({ offersPage, offerDetailsPage }, data);
    // });
});
