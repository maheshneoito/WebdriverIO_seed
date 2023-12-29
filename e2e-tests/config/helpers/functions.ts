const yargs = require('yargs/yargs')
const argv = yargs(process.argv.slice(2)).parseSync();
// import Jimp from 'jimp';
const { generate } = require('multiple-cucumber-html-reporter');
const fs = require('fs')

/**
 * Get the featurefiles that need to be run based on an command line flag that is passed, if nothing is passed all the
 * featurefiles will run.
 *
 * @example:
 *
 *     // For 1 feature
 *     npm run android.app -- --feature=home
 *
 *     // For multiple features
 *     npm run android.app -- --feature=home,login,...
 *
 */
export const getFeatureFiles = (featureTagOnly: boolean = false, dom: any, env: any): any => {
  
    /**
     * get all the files from the feature files folder
    */
    const directoryPath = `${process.cwd()}/e2e-tests/features/`;    
    const fileNames = fs.readdirSync(directoryPath);
    // /**
    //  * removes the extention from the file name
    // */
    const fileList = fileNames.map((file:any) => file.split('.').slice(0, -1).join('.'));
    // //get domain and env, then get the skip feature list of that domain then remove the features from the feature list passed to the spec.
    // const skipDom =(skipList as any)[dom][env];
    // // console.log({skipDom});
    
    const featureName: any = argv.feature;
    if (argv.feature) {
        let fSet =featureTagOnly ? argv.feature:
         featureName.split(',').map((feature: any) => `${process.cwd()}/e2e-tests/**/${feature}.feature`);
        return fSet;
    }

    else if (argv.featureset) {

        let featureNames = '';
        const featureSet:any=argv.featureset
        const featureSetKeys = Object.keys(featureSet);
        featureSet.split(',').map( (featureSetName:any) => featureSetKeys.filter(function (key) {
            if (key === featureSetName) {
                const updatedFeatureSet = featureSet[key].replace(/(^,)|(,$)/g, "");
                featureNames += featureNames === '' ? updatedFeatureSet : ',' + updatedFeatureSet;
            }
        })
        );
        const features = featureNames.split(',').map(feature => `${process.cwd()}/e2e-tests/**/${feature}.feature`);
        console.log("Features: " + featureNames);
        return features;
    }  
    const allFeatures = fileList.map((feature:any) => `${process.cwd()}/e2e-tests/**/${feature}.feature`); 
    return allFeatures;

}

/**
 * Get the site url based on the domain tag, if any.
 * Default domain: .com
 * Default Environment(env): stage
 */
export const getBaseUrl = function (env:any = "stage") {
    return `www.google.com`;
}

export const getEnv = () => {
    let env = "stage";
    if (argv.env === "www") {
        env = "prod";
    }
    if (argv.env === "dev" ) {
        env = "dev";
    }
    return env;
}

/**
 * Function to generate cucumber HTML report.
 */
export const generateReport = async (): Promise<void> => {
    if (fs.existsSync('./reports')) {
        if (fs.existsSync('./reports/report')) {
            fs.rmdirSync('./reports/report', { recursive: true });
        }
        await generate({
            jsonDir: './reports/json/',
            reportPath: './reports/report/',
            pageTitle: 'PartsTown HTML Report',
            reportName: `Automation report for site: ${argv.mobile ? 'Mobile web (' + getEnv().toUpperCase() + ')' +"  "  +  'Website:'+ getBaseUrl(argv.env) : 'Desktop (' +  getEnv().toUpperCase() + ')'+"  "  +  'Website:'+ getBaseUrl(argv.env)}`,
            displayDuration: true,
        });
    }
}

export const getBrowserName = () => {
    let browser = 'chrome';
    if (argv.browserName) {
        if (argv.browserName === 'firefox') {
            browser = 'firefox'
        }
        else if (argv.browserName === 'edge') {
            browser = 'edge';
        }
        else if (argv.browserName === 'safari') {
            browser = 'safari';
        }
        else if (argv.browserName === 'ie') {
            browser = 'ie';
        }
    }
    return browser;
}

/**
 * Get list of tags that need to be run based on an command line flag that is passed, if nothing is passed all the
 * featurefiles(e2e) will run.
 * 
 *
 * @example:
 * 
 *     // For 1 smoke tag
 *     npm run android.app -- --tags=@home
 *
 *     // For multiple smoke tags
 *     npm run android.app -- --tags=@home,@login,...
 */
export const getTags = (): string => {
    const tags: any = argv.tags;
    if (argv.tags) {
        return tags.replace(/(^,)|(,$)/g, "").split(',').join(' or ');
    }
    return '';
}