
package eu.agileeng.ws.client;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for com.sagemcom.dematbox.frontal.dematbox.service.FaultBean complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="com.sagemcom.dematbox.frontal.dematbox.service.FaultBean">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="codeError" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="displayError" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="docId" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="virtualBoxId" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "com.sagemcom.dematbox.frontal.dematbox.service.FaultBean", namespace = "http://service.dematbox.frontal.dematbox.sagemcom.com/", propOrder = {
    "codeError",
    "displayError",
    "docId",
    "virtualBoxId"
})
public class ComSagemcomDematboxFrontalDematboxServiceFaultBean {

    @XmlElement(required = true)
    protected String codeError;
    @XmlElement(required = true)
    protected String displayError;
    @XmlElement(required = true)
    protected String docId;
    @XmlElement(required = true)
    protected String virtualBoxId;

    /**
     * Gets the value of the codeError property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCodeError() {
        return codeError;
    }

    /**
     * Sets the value of the codeError property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCodeError(String value) {
        this.codeError = value;
    }

    /**
     * Gets the value of the displayError property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDisplayError() {
        return displayError;
    }

    /**
     * Sets the value of the displayError property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDisplayError(String value) {
        this.displayError = value;
    }

    /**
     * Gets the value of the docId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDocId() {
        return docId;
    }

    /**
     * Sets the value of the docId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDocId(String value) {
        this.docId = value;
    }

    /**
     * Gets the value of the virtualBoxId property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getVirtualBoxId() {
        return virtualBoxId;
    }

    /**
     * Sets the value of the virtualBoxId property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setVirtualBoxId(String value) {
        this.virtualBoxId = value;
    }

}
