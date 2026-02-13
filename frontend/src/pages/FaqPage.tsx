import DefaultLayout from "@layouts/default";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Link } from "@heroui/link";
import { Card, CardBody, CardHeader } from "@heroui/card";

export default function FaqPage() {
	return (
		<DefaultLayout>
			<Card className="w-[95vw] md:w-[50vw] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2">
				<CardHeader>
					<span className="w-full text-xl font-semibold text-center">
						Frequently Asked Questions
					</span>
				</CardHeader>
				<CardBody>
					<Accordion variant="splitted">
						<AccordionItem
							key="1"
							aria-label="Accordion 1"
							title="I can't add games even though I'm logged in!"
						>
							<span>
								Ensure cookies are enabled for <i>civboards.ca.auth0.com</i>.
								The user authorization relies on them. If this still doesn't
								work, try clearing your cookies and log out then back in. This
								should also fix any problems with editing and deleting games.
							</span>
						</AccordionItem>
						<AccordionItem
							key="2"
							aria-label="Accordion 2"
							title="Can I contribute to this?"
						>
							<span>
								Absolutely! Feel free to suggest and build features, as well as
								report bugs. The GitHub repo can be found at{" "}
								<Link
									isExternal
									showAnchorIcon
									href="https://github.com/JerryJTJ/civboards"
								>
									JerryJTJ/civboards
								</Link>
								.
							</span>
						</AccordionItem>
						<AccordionItem
							key="3"
							aria-label="Accordion 3"
							title="I have a problem that isn't listed here!"
						>
							<span>
								Feel free to contact me at{" "}
								<Link isExternal href="mailto:civboards@icloud.com">
									civboards@icloud.com
								</Link>
								.
							</span>
						</AccordionItem>
					</Accordion>
				</CardBody>
			</Card>
		</DefaultLayout>
	);
}
