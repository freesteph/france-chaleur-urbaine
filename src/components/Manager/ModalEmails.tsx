import {
  Button,
  ModalClose,
  ModalContent,
  Select,
  TextInput,
} from '@dataesr/react-dsfr';
import { FormEvent, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  HorizontalSeparator,
  ModalContentWrapper,
  StyledModal,
} from './ModalEmails.style';
import Heading from '@components/ui/Heading';
import emailsList from '@data/manager/manager-emails-list';
import emailsContentList from '@data/manager/manager-emails-content';
import { Demand } from 'src/types/Summary/Demand';

type Props = {
  isOpen: boolean;
  currentDemand: Demand;
  updateDemand: (demandId: string, demand: Partial<Demand>) => void;
  onClose: (...args: any[]) => any;
};
type EmailContent = {
  object: string;
  to: string;
  body: string;
  signature: string;
  cc: string;
  replyTo: string;
};
function ModalEmails(props: Props) {
  const getDefaultEmailContent = () => {
    return {
      object: '',
      to: props.currentDemand.Mail,
      body: '',
      signature: session?.user.signature || '',
      cc: session?.user.email || '',
      replyTo: session?.user.email || '',
    };
  };

  const { data: session, update } = useSession();
  const [isLoaded, setIsLoaded] = useState(false);

  const [alreadySent, setAlreadySent] = useState<string[]>([]);
  const [emailKey, setEmailKey] = useState('');
  const [emailContent, setEmailContent] = useState<EmailContent>(
    getDefaultEmailContent()
  );
  const [sent, setSent] = useState(false);
  const [sentError, setSentError] = useState(false);
  const [sentHistory, setSentHistory] = useState<[]>();

  const loadModal = () => {
    setAlreadySent([]);
    setEmailKey('');
    setEmailContent(getDefaultEmailContent);
    setSent(false);
    setSentError(false);
    setSentHistory(undefined);
  };

  useEffect(() => {
    const getEmailsHistory = async () => {
      const res = await fetch(
        `/api/managerEmail?demand_id=${props.currentDemand.id}`,
        {
          method: 'GET',
        }
      );
      const list = await res.json();
      setSentHistory(list);
    };
    if (props.isOpen) {
      if (!isLoaded) {
        loadModal();
        setIsLoaded(true);
      }
      if (!sentHistory) {
        getEmailsHistory();
      }
    }
  }, [props.isOpen]);

  useEffect(() => {
    if (props.currentDemand['Emails envoyés']) {
      setAlreadySent(props.currentDemand['Emails envoyés'].split('\n'));
    }
  }, [props.currentDemand]);

  function setEmailContentValue<Key extends keyof EmailContent>(
    key: Key,
    value: EmailContent[Key]
  ) {
    setEmailContent((emailContent) => ({
      ...emailContent,
      [key]: value,
    }));
  }

  const onSelectedEmailChanged = (emailKey: string) => {
    setEmailKey(emailKey);
    setEmailContentValue('object', emailsContentList[emailKey].object);
    const body = emailsContentList[emailKey].body.replace(
      '[adresse]',
      props.currentDemand.Adresse
    );
    setEmailContentValue('body', body);
  };

  const getLabel = (key: string) => {
    const email = emailsList.find((email) => {
      if (email.value === key) {
        return email;
      }
    });
    return email ? email.label : '';
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //Save content in DB
    try {
      const res = await fetch(`/api/managerEmail`, {
        method: 'POST',
        body: JSON.stringify({
          emailContent,
          demand_id: props.currentDemand.id,
          key: emailKey,
        }),
      });
      if (res.status !== 200) {
        throw new Error(`invalid status ${res.status}`);
      }

      //Add email in Airtable demands list
      alreadySent.push(getLabel(emailKey));
      const updatedFields: any = {
        'Emails envoyés': alreadySent.join('\n'),
        'Prise de contact': true, //Prospect recontacté
      };
      if (
        emailKey === 'koFarFromNetwok' ||
        emailKey === 'koIndividualHeat' ||
        emailKey === 'koOther'
      ) {
        updatedFields.Status = 'Non réalisable';
      } else if (emailKey === 'askForPieces') {
        updatedFields.Status = 'En attente d’éléments du prospect';
      }
      await props.updateDemand(props.currentDemand.id, updatedFields);

      //Update the current user signature
      if (session && session.user.signature !== emailContent.signature) {
        update({ signature: emailContent.signature });
      }

      setSent(true);
    } catch (err: any) {
      setSentError(true);
    }
  };

  return (
    <StyledModal
      isOpen={props.isOpen}
      hide={() => {
        //resetModal();
        props.onClose();
        setIsLoaded(false);
      }}
    >
      <ModalClose>Fermer</ModalClose>
      <ModalContent>
        <ModalContentWrapper>
          <Heading as="h2" center>
            Envoi d'un courriel à {emailContent?.to}
          </Heading>
          {!sent && !sentError ? (
            <>
              <HorizontalSeparator />
              <div className="fr-mt-3w fr-mb-3w">
                <b>Historique</b>
                <br />
                <ul className="fr-ml-3w">
                  {sentHistory && sentHistory.length > 0 ? (
                    sentHistory.map((item: any, index) => (
                      <li key={index}>
                        {getLabel(item.email_key)} envoyé le {item.date}
                      </li>
                    ))
                  ) : (
                    <li>Aucun courriel envoyé</li>
                  )}
                </ul>
              </div>
              <HorizontalSeparator className="fr-mb-3w" />
              <Select
                required
                label="Choix de la réponse"
                options={[
                  {
                    value: '',
                    label: '- Sélectionner une réponse -',
                    disabled: true,
                    hidden: true,
                  },
                  ...emailsList.map((option) => {
                    return {
                      value: option.value,
                      label: option.label,
                      disabled:
                        sentHistory &&
                        option.value !== 'other' &&
                        sentHistory.some(
                          (email: any) => email.email_key === option.value
                        ),
                    };
                  }),
                ]}
                selected={emailKey}
                onChange={(e) => onSelectedEmailChanged(e.target.value)}
              />
              <HorizontalSeparator className="fr-mb-3w" />
              <form
                onSubmit={submit}
                className="fr-col-12 fr-col-md-10 fr-col-lg-8 fr-col-xl-6"
              >
                <TextInput
                  required
                  label="Répondre à"
                  type="email"
                  value={emailContent.replyTo}
                  onChange={(e) =>
                    setEmailContentValue('replyTo', e.target.value)
                  }
                />
                <TextInput
                  label="Copie à"
                  hint="Les adresses emails doivent être séparées par des virgules"
                  value={emailContent?.cc}
                  onChange={(e) => setEmailContentValue('cc', e.target.value)}
                />
                <TextInput
                  required
                  label="Objet"
                  value={emailContent.object}
                  onChange={(e) =>
                    setEmailContentValue('object', e.target.value)
                  }
                />
                <TextInput
                  required
                  label="Corps"
                  textarea
                  value={emailContent.body}
                  onChange={(e) => setEmailContentValue('body', e.target.value)}
                  rows={10}
                />
                <TextInput
                  required
                  label="Signature"
                  hint="La signature sera sauvegardée pour le prochain envoi"
                  value={emailContent.signature}
                  onChange={(e) =>
                    setEmailContentValue('signature', e.target.value)
                  }
                />
                <Button className="fr-mt-2w" submit>
                  Envoyer
                </Button>
              </form>
            </>
          ) : (
            <>
              {sentError ? (
                <span>
                  Il y a eu une erreur au cours de votre envoi.
                  <br />
                  Veuillez ré-essayer.
                </span>
              ) : (
                <span>Votre courriel a bien été envoyé !</span>
              )}
            </>
          )}
        </ModalContentWrapper>
      </ModalContent>
    </StyledModal>
  );
}

export default ModalEmails;
