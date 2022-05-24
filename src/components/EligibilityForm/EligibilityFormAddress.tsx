import AddressAutocomplete from '@components/addressAutocomplete/AddressAutocomplete';
import convertPointToCoordinates from '@utils/convertPointToCoordinates';
import React, { useCallback, useEffect, useState } from 'react';
import { usePreviousState } from 'src/hooks';
import { useServices } from 'src/services';
import { Coords, Point } from 'src/types';
import { CheckEligibilityFormLabel, SelectEnergy } from './components';

type CheckEligibilityFormProps = {
  formLabel?: React.ReactNode;
  centredForm?: boolean;
  onChange?: (...arg: any) => void;
  onFetch?: (...arg: any) => void;
  onSuccess?: (...arg: any) => void;
};

const AddressTestForm: React.FC<CheckEligibilityFormProps> = ({
  formLabel,
  centredForm,
  children,
  onChange,
  onFetch,
  onSuccess,
}) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState({});
  const prevData = usePreviousState(data);
  const { heatNetworkService } = useServices();
  const checkEligibility = useCallback(
    async ({
      address,
      coords,
      geoAddress,
    }: {
      address?: string;
      coords: Coords;
      geoAddress?: any;
    }) => {
      try {
        setStatus('loading');
        const networkData = await heatNetworkService.findByCoords(coords);
        const { isEligible: eligibility, network } = networkData;
        setData({ ...data, eligibility, address, coords, geoAddress, network });
        setStatus('success');
      } catch (e) {
        setStatus('error');
      }
    },
    [data, heatNetworkService]
  );

  const handleAddressSelected = useCallback(
    async (address: string, point: Point, geoAddress: any): Promise<void> => {
      if (onFetch) onFetch({ address, point, geoAddress });
      const coords: Coords = convertPointToCoordinates(point);
      await checkEligibility({ address, coords, geoAddress });
    },
    [checkEligibility, onFetch]
  );

  useEffect(() => {
    if (status === 'success' && onSuccess) {
      onSuccess(data);
    }
  }, [data, onSuccess, status]);

  useEffect(() => {
    if (prevData !== data && onChange) {
      onChange(data);
    }
  }, [data, onChange, prevData]);

  return (
    <>
      {children}
      <CheckEligibilityFormLabel centred={centredForm}>
        <SelectEnergy
          name="chauffage"
          selectOptions={{
            collectif: 'Chauffage collectif',
            individuel: 'Chauffage individuel',
          }}
          onChange={(e) => {
            setData({
              ...data,
              chauffage: e.target.value,
            });
          }}
        >
          {formLabel}
        </SelectEnergy>
      </CheckEligibilityFormLabel>
      <AddressAutocomplete
        placeholder="Tapez ici votre adresse"
        onAddressSelected={handleAddressSelected}
      />
    </>
  );
};

export default AddressTestForm;
