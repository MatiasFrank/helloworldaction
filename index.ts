import { getInput, setOutput, setFailed } from "@actions/core";
import { context } from "@actions/github";
import { apiKey, auth } from "@nuntio/sdk/lib/auth";
import { UserIdentifier } from "@nuntio/api/model/user_pb";
import { CreateBuildRequest } from "@nuntio/api/api/v1/capsule/service_pb";
import { NuntioClient, nuntio, nuntioId } from "@nuntio/sdk/lib/nuntio";
import { UUID } from "@nuntio/api/model/uuid_pb.js";
import { Message, proto3 } from "@bufbuild/protobuf";

interface Inputs {
  username?: string;
  email?: string;
  phonenumber?: string;
  password: string;
  url: string;
  image: string;
  msb: string;
  lsb: string;
  buildID?: string;
}

function makeUserIdentifier(inputs: Inputs): UserIdentifier {
  if (inputs.username !== undefined && inputs.username != "") {
    return UserIdentifier.fromJson({
      username: inputs.username,
    });
  }
  if (inputs.email !== undefined && inputs.email != "") {
    return UserIdentifier.fromJson({
      email: inputs.email,
    });
  }
  if (inputs.phonenumber !== undefined && inputs.phonenumber != "") {
    return UserIdentifier.fromJson({
      phonenumber: inputs.phonenumber,
    });
  }

  throw new Error("no identifier was chosen");
}

function getBuildID(inputs: Inputs): string {
  if (inputs.buildID) {
    return inputs.buildID;
  }

  return context.sha.substring(0, 10);
}

async function action(inputs: Inputs) {
  let manager = auth();
  manager.setBaseURL(inputs.url);
  await manager.login(makeUserIdentifier(inputs), inputs.password);

  const uuid = UUID.fromJson({ msb: inputs.msb, lsb: inputs.lsb });
  const client = nuntio("a918fa45-4d17-46ca-aee9-7ef16afa62bb");
  client.setBaseURL(inputs.url);
  const buildID = getBuildID(inputs);
  await client.capsuleClient.createBuild(
    new CreateBuildRequest({
      buildId: buildID,
      image: inputs.image,
      capsuleId: uuid,
    }),
  );
  setOutput("buildID", buildID);
}

try {
  action({
    email: getInput("email"), //"admin@nuntio.io",
    password: getInput("password"), //"TeamNuntio22!",
    url: getInput("url"), //"http://localhost:4747/",
    image: getInput("image"), //"9526fe5f94af",
    msb: getInput("msb"), //"10131572704171216282",
    lsb: getInput("lsb"), //"12395029164007084783",
    buildID: getInput("buildID"), //"someid",
  });
} catch (e: any) {
  setFailed(e.message);
}
