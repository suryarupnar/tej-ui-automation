import { test, expect } from "../../fixtures";
import { shipmentDetailsData, cargoData, mawbData, hawbData, mblData, hblData, waybillData } from "../../data/shipment.data";

const scenarios = [
    // Air Scenarios
    { type: 'Air Inbound',     mode: 'MAWB Only',   tags: '@air @inbound' },
    { type: 'Air Inbound',     mode: 'MAWB & HAWB', tags: '@air @inbound @hawb' },
    { type: 'Air Outbound',    mode: 'MAWB Only',   tags: '@air @outbound' },
    { type: 'Air Outbound',    mode: 'MAWB & HAWB', tags: '@air @outbound @hawb' },
    { type: 'Air Cross Trade', mode: 'MAWB Only',   tags: '@air @crosstrade' },
    { type: 'Air Cross Trade', mode: 'MAWB & HAWB', tags: '@air @crosstrade @hawb' },
    { type: 'Air Domestic',    mode: 'MAWB Only',   tags: '@air @domestic' },
    { type: 'Air Domestic',    mode: 'MAWB & HAWB', tags: '@air @domestic @hawb' },

    // Land Scenarios
    { type: 'Land Inbound',     mode: 'Waybill', tags: '@land @inbound' },
    { type: 'Land Outbound',    mode: 'Waybill', tags: '@land @outbound' },
    { type: 'Land Cross Trade', mode: 'Waybill', tags: '@land @crosstrade' },
    { type: 'Land Domestic',    mode: 'Waybill', tags: '@land @domestic' },

    // Sea Scenarios
    { type: 'Sea Inbound',     mode: 'MB/L Only',   tags: '@sea @inbound' },
    { type: 'Sea Inbound',     mode: 'MB/L & HB/L', tags: '@sea @inbound @hbl' },
    { type: 'Sea Outbound',    mode: 'MB/L Only',   tags: '@sea @outbound' },
    { type: 'Sea Outbound',    mode: 'MB/L & HB/L', tags: '@sea @outbound @hbl' },
    { type: 'Sea Cross Trade', mode: 'MB/L Only',   tags: '@sea @crosstrade' },
    { type: 'Sea Cross Trade', mode: 'MB/L & HB/L', tags: '@sea @crosstrade @hbl' },
    { type: 'Sea Domestic',    mode: 'MB/L Only',   tags: '@sea @domestic' },
    { type: 'Sea Domestic',    mode: 'MB/L & HB/L', tags: '@sea @domestic @hbl' },
];

test.describe('Full Shipment Automation Suite (20 Combinations)', () => {

    for (const scenario of scenarios) {
        test(`${scenario.type} - ${scenario.mode} ${scenario.tags}`, async ({ shipmentsPage, shipmentEditPage }) => {
            
            const fullData = { 
                details: {
                    ...shipmentDetailsData, 
                    shipmentType: scenario.type, 
                    shipmentMode: scenario.mode 
                },
                cargo: cargoData,
                mawb: mawbData,
                hawb: hawbData,
                mbl: mblData,
                hbl: hblData,
                waybill: waybillData
            };

            await test.step('Step 1: Create Shipment', async () => {
                await shipmentsPage.goto();
                await shipmentsPage.createNewRegularShipment(fullData);
            }); 

            let shipmentNum: string = '';
            await test.step('Step 2: Capture Shipment Number', async () => {
                shipmentNum = await shipmentEditPage.generateNum();
            });

            await test.step('Step 3: Fill All Tabs', async () => {
                // Fill basic details
                await shipmentEditPage.shipmentFill(fullData.details);

                // Cargo is universal
                await shipmentEditPage.cargoFill(fullData.cargo);

                // Mode specific tabs
                if (scenario.tags.includes('@air')) {
                    await shipmentEditPage.mawbFill(mawbData);
                    if (scenario.mode.includes('HAWB')) {
                        await shipmentEditPage.hawbFill(hawbData);
                    }
                } else if (scenario.tags.includes('@sea')) {
                    await shipmentEditPage.mblFill(mblData);
                    if (scenario.mode.includes('HBL')) {
                        await shipmentEditPage.hblFill(hblData);
                    }
                } else if (scenario.tags.includes('@land')) {
                    await shipmentEditPage.waybillFill(waybillData);
                }
            });

            await test.step('Step 4: Persistence Check (Search & Open)', async () => {
                // Re-locate the shipment to ensure data is saved
                await shipmentsPage.openShipmentBySerialNo(shipmentNum);
            });

            await test.step('Step 5: Validate Data', async () => {
                await shipmentEditPage.shipmentValidate(fullData.details);
                await shipmentEditPage.cargoValidate(fullData.cargo);
                
                if (scenario.tags.includes('@air')) {
                    await shipmentEditPage.mawbValidate(fullData.mawb);
                    if (scenario.mode.includes('HAWB')) await shipmentEditPage.hawbValidate(fullData.hawb);
                } else if (scenario.tags.includes('@sea')) {
                    await shipmentEditPage.mblValidate(fullData.mbl);
                    if (scenario.mode.includes('HBL')) await shipmentEditPage.hblValidate(fullData.hbl);
                } else if (scenario.tags.includes('@land')) {
                    await shipmentEditPage.waybillValidate(fullData.waybill);
                }
            });
        });
    }
});
